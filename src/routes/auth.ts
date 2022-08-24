import { login } from "controllers/auth";
import express from "express";
import { body } from "express-validator";

export const authRouter = express.Router();

const loginValidator = [
  body("username")
    .isString()
    .isLength({ min: 5, max: 50 })
    .withMessage(
      "Username must be atleast 3 characters long and at most 50 characters long"
    ),
  body("email").isEmail().withMessage("Provide a valid email id"),
  body("name")
    .isString()
    .isLength({ min: 3, max: 60 })
    .withMessage(
      "Name must be atleast 3 characters long and at most 60 characters long"
    ),
  body("providerId")
    .isString()
    .isLength({ min: 20, max: 22 })
    .withMessage("Provide a valid Provider ID"),
  body("image")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Provide a profile image"),
];

authRouter.route("/auth/login").post(loginValidator, login);
