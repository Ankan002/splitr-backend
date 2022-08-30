import { Router } from "express";
import { isAuthenticated } from "middlewares/auth";
import { createGroup, getAllGroups } from "controllers/group";

export const groupRouter = Router();

groupRouter.route("/group/create").post(isAuthenticated, createGroup);

groupRouter.route("/groups").get(isAuthenticated, getAllGroups);
