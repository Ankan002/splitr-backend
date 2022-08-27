import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getPrismaClient } from "config/prisma-instance";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { generateUsername } from "helpers/generate-username";
import jwt from "jsonwebtoken";
import JWTDecode, { InvalidTokenError } from "jwt-decode";

interface GoogleProfile {
    iss: string;
	nbf: number;
	aud: string;
	sub: string;
	email: string;
	email_verified: boolean;
	azp: string;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: number;
	exp: number;
	jti: string;
}

const prismaInstance = getPrismaClient();

export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1]?.msg : errors.array()[0]?.msg,
        });
    }

    const { jwtProfileToken } = req.body;

    const profile: GoogleProfile = JWTDecode(jwtProfileToken);

    const { sub, name, email, email_verified, picture } = profile;

    if(!email_verified) {
        return res.status(400).json({
            success: false,
            error: "Email not verified!!",
        });
    }

    if (
        !profile.sub ||
        !profile.name ||
        !profile.email ||
        !profile.picture
    ) {
        return res.status(400).json({
            success: false,
            error: "Inavlid profile jwt. Please verify and retry.",
            code: 400,
        });
    }

    const username = generateUsername(email);

    try {
        const existingUser = await prismaInstance.user.findFirst({
            where: {
                providerId: sub
            }
        });

        if(existingUser) {
            const user = {
                id: existingUser.id,
            };

            const authToken = jwt.sign(user, process.env["SECRET"] ?? "");

            return res.status(200).setHeader("authToken", authToken).json({
                success: true
            });
        }

        const newUser = await prismaInstance.user.create({
            data: {
                username,
                email,
                name,
                providerId: sub,
                image: picture
            }
        });

        const user = {
            id: newUser.id
        };

        const authToken = jwt.sign(user, process.env["SECRET"] ?? "");

        return res.status(200).setHeader("authToken", authToken).json({
            success: true
        });
    }
    catch(error){

        if(error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError || error instanceof PrismaClientValidationError || error instanceof Error || error instanceof InvalidTokenError) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        return res.status(400).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
}
