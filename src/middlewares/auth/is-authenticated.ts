import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { logger } from "utils/logger";

export const isAuthenticated = async(req:Request, res: Response, next: NextFunction) => {
    const authToken = req.header("authToken");

    if(!authToken){
        return res.status(400).json({
            success: false,
            error: "Please supply a valid credentials"
        });
    }

    try {
        const user: any = jwt.verify(authToken, process.env["SECRET"] ?? "");
        
        req.user = user.id;

        next();
    }
    catch(error){
        logger.error(error);

        if(error instanceof JsonWebTokenError || error instanceof Error){
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
};
