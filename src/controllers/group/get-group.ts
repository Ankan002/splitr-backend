import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getPrismaClient } from "config/prisma-instance";
import { Request, Response } from "express";
import { logger } from "utils/logger";

const prismaInstance = getPrismaClient();

export const getGroupById = async (req: Request, res: Response) => {
    const groupId = req.params["id"];

    if(!groupId){
        return res.status(400).json({
            success: false,
            error: "Please pass a group id to find"
        });
    }

    try{
        const group = await prismaInstance.group.findUniqueOrThrow({
            where: {
                id: groupId
            },
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                members: {
                    select: {
                        member: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    take: 5
                }
            }
        });

        return res.status(200).json({
            success: true,
            group
        });
    }
    catch(error){
        logger.error(error);

        if(error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError || error instanceof PrismaClientValidationError || error instanceof Error) {
            return res.status(400).json({
                success: false,
                error: error.message.toString()
            });
        }

        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
}