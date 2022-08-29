import express, { Request, Response } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { authRouter } from "routes/auth";
import { morganConfig } from "middlewares/morgan";
import { logger } from "utils/logger";
import { userRouter } from "routes/user";
import { groupRouter } from "routes/group";


export const startServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(morganConfig);
    app.use(fileUpload({
        useTempFiles: true
    }));

    app.get("/", async(req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: "Welcome to Splitr API!!"
        });
    });

    app.use("/api", authRouter);
    app.use("/api", userRouter);
    app.use("/api", groupRouter);

    app.listen(process.env["PORT"], () => logger.info(`App is running at ${process.env["PORT"]}`));
};
