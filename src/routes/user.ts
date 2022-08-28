import { Router } from "express";
import { isAuthenticated } from "middlewares/auth";
import { getUser, getUserByUsername } from "controllers/user";

export const userRouter = Router();

userRouter.route("/user/self").get(isAuthenticated, getUser);

userRouter.route("/user").get(isAuthenticated, getUserByUsername);
