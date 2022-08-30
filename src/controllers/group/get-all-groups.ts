import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getPrismaClient } from "config/prisma-instance";
import { Request, Response } from "express";
import { logger } from "utils/logger";

const prismaInstance = getPrismaClient();

export const getAllGroups = async (req: Request, res: Response) => {
    const userId = req.user;

    const pageNumber = parseInt(req.query["page"]?.toString() ?? "1");
    const numberOfGroups = parseInt(req.query["quantity"]?.toString() ?? "15");

    try{
        const groups = await prismaInstance.group.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            },
            skip: (pageNumber - 1) * numberOfGroups,
            take: numberOfGroups,
            select: {
                id: true,
                name: true,
                image: true
            },
            orderBy: {
                created_at: "desc"
            }
        })

        return res.status(200).json({
            success: true,
            data: {
                groups
            }
        });
    }
    catch(error){
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