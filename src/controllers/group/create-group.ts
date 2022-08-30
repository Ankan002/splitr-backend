import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { getCloudinaryInstance } from "config/cloudinary-instance";
import { getPrismaClient } from "config/prisma-instance";
import { Request, Response } from "express";
import fs from "fs";
import { logger } from "utils/logger";

const prismaInstance = getPrismaClient();
const cloudinaryInstance = getCloudinaryInstance();

interface MembersInGroup {
    userId: string;
    groupId: string;
}


export const createGroup = async (req: Request, res: Response) => {

    const image: any = req.files ? req.files["image"] : undefined;
    const { name, description } = req.body;
    const userId = req.user;

    let groupImageUrl = "https://thumbs.dreamstime.com/b/people-icon-vector-group-chat-assembly-point-team-158447407.jpg";

    try {
        const members = JSON.parse(req.body.members);

        if(name.length < 3 || name.length > 50){
            fs.unlink(image.tempFilePath, (e) => logger.error(e));
            return res.status(400).json({
                success: false,
                error: "Group name should be at least 3 characters long and at most 50 characters long"
            });
        }

        if(description.length < 20 || description.length > 300){
            fs.unlink(image.tempFilePath, (e) => logger.error(e));
            return res.status(400).json({
                success: false,
                error: "Group description should be at least 20 characters long and at most 300 characters long"
            });
        }

        if(members.includes(userId)){
            fs.unlink(image.tempFilePath, (e) => logger.error(e));
            return res.status(400).json({
                success: false,
                error: "You cannot be in a group 2 times.... You do not have a multi-personality disorder I believe!!"
            });
        }

        if(members.length < 1 || members.length > 49){
            fs.unlink(image.tempFilePath, (e) => logger.error(e));
            return res.status(400).json({
                success: false,
                error: "Please provide us at least 1 of your friends and at most 49 friends"
            });
        }

        members.unshift(userId);
        const filteredMembers: Set<string> = new Set(members);

        if(image){
            const uploadedImage = await cloudinaryInstance.uploader.upload(image?.tempFilePath, {
                folder: "splitr/group-images"
            });

            groupImageUrl = uploadedImage.secure_url;
        }

        fs.unlink(image.tempFilePath, (e) => console.log(e));

        const newGroup = await prismaInstance.group.create({
            data: {
                name,
                description,
                image: groupImageUrl
            },
            select: {
                id: true,
                name: true,
                description: true,
                image: true
            }
        });

        const membersInGroupData: Array<MembersInGroup> = [];

        filteredMembers.forEach((member) => {
            membersInGroupData.push({
                userId: member,
                groupId: newGroup.id
            });
        });

        await prismaInstance.membersInGroup.createMany({
            data: membersInGroupData
        });

        return res.status(200).json({
            success: true,
            data: {
                group: newGroup
            }
        });
    }
    catch(error){
        logger.error(error);

        fs.unlink(image.tempFilePath, (e) => console.log(e));

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
}