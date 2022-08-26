import { login } from "controllers/auth";
import express from "express";
import { body } from "express-validator";

export const authRouter = express.Router();

const loginValidator = [
  body("jwtProfileToken").isString().withMessage("Please provide a valid jwt")
];

authRouter.route("/auth/login").post(loginValidator, login);
