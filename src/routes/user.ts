import { Router } from "express";
import { isAuthenticated } from "middlewares/auth";
import { getUser, getUserByUsername, updateUsername } from "controllers/user";
import { body } from "express-validator";

export const userRouter = Router();

const updateUsernameValidator = [
    body("username").isString().isLength({ min: 3, max: 50 }).withMessage("The username should be at least 3 characters long and atmost 50 characters long")
];

userRouter.route("/user/self").get(isAuthenticated, getUser);

userRouter.route("/user").get(isAuthenticated, getUserByUsername);

userRouter.route("/user/username/update").put(isAuthenticated, updateUsernameValidator, updateUsername);
