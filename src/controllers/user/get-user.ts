import { Request, Response } from "express";
import { getPrismaClient } from "config/prisma-instance";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

const primsaInstance = getPrismaClient();

export const getUser = async (req: Request, res: Response) => {
    const userId = req.user;

    try {
        const user = await primsaInstance.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                email: true,
                providerId: true,
                created_at: true,
                updated_at: true
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    }
    catch(error) {
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
