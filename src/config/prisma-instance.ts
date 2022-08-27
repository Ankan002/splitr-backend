import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient;

export const getPrismaClient = () => {
    if(!prismaInstance){
        prismaInstance = new PrismaClient();
    }

    return prismaInstance;
}