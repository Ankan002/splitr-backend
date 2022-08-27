import { Router } from "express";
import { isAuthenticated } from "middlewares/auth";
import { getUser } from "controllers/user";

export const userRouter = Router();

userRouter.route("/user/self").get(isAuthenticated, getUser);
