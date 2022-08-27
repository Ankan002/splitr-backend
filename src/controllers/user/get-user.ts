// import { getPrismaClient } from "config/prisma-instance";

import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
    console.log(req.user);

    return res.status(200).json({
        success: true,
        message: "I am running!!"
    });
};
