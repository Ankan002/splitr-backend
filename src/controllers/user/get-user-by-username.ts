import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getPrismaClient } from "config/prisma-instance";
import { Request, Response } from "express";
import { logger } from "utils/logger";

const prismaInstance = getPrismaClient();

export const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.query;

    if(!username){
        return res.status(400).json({
            success: false,
            error: "Please provide a valid username to search"
        });
    }

    try {
        const user = await prismaInstance.user.findUnique({
            where: {
                username: username as string
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                email: true
            }
        });

        if(!user){
            return res.status(400).json({
                success: false,
                error: "No user found with that username"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    }
    catch(error) {
        logger.error(error);

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