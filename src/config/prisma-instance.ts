import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient;

export const getPrismClient = () => {
    if(!prismaInstance){
        prismaInstance = new PrismaClient();
    }

    return prismaInstance;
}