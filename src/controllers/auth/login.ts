import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getPrismClient } from "config/prisma-instance";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { isValidUsername } from "helpers/is-valid-username";
import jwt from "jsonwebtoken";

const prismaInstance = getPrismClient();

export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1]?.msg : errors.array()[0]?.msg,
        });
    }

    const { username, email, name, providerId, image } = req.body;

    if(isValidUsername(username) === false){
        return res.status(400).json({
            success: false,
            error: "Provide a valid username!!"
        });
    }

    try {
        const existingUser = await prismaInstance.user.findFirst({
            where: {
                providerId
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
                providerId,
                image
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

        if(error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError || error instanceof PrismaClientValidationError || error instanceof Error) {
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
