import express, { Request, Response } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { authRouter } from "routes/auth";

export const startServer = () => {
    const app = express();

    app.use(cors());
    app.use(fileUpload({
        useTempFiles: true
    }));

    app.get("/", (req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: "Welcome to Splitr API!!"
        });
    });

    app.use("/api", authRouter);

    app.listen(process.env["PORT"], () => console.log(`App is running at ${process.env["PORT"]}`));
};
