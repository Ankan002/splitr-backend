import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getPrismaClient } from "config/prisma-instance";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { validateUsername } from "helpers/username";
import { logger } from "utils/logger";

const prismaInstance = getPrismaClient();

export const updateUsername = async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1]?.msg : errors.array()[0]?.msg
        });
    }

    const userId = req.user;
    const { username } = req.body;

    if(!validateUsername(username)){
        return res.status(400).json({
            success: false,
            error: "Username must not contain _gal at the end or empty spaces"
        });
    }

    try{
        const updatedUser = await prismaInstance.user.update({
            where: {
                id: userId
            },
            data: {
                username
            },
            select: {
                id: true,
                username: true,
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                username: updatedUser.username,
            }
        });

    }
    catch(error){
        logger.error(error);

        if(error instanceof PrismaClientKnownRequestError && error.code === "P2002"){
            return res.status(400).json({
                success: false,
                error: "An user with the same username already exists"
            });
        }

        if(error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError || error instanceof PrismaClientValidationError || error instanceof Error) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
};
