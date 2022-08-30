import { Router } from "express";
import { isAuthenticated } from "middlewares/auth";
import { createGroup, getAllGroups, getGroupById } from "controllers/group";

export const groupRouter = Router();

groupRouter.route("/group/create").post(isAuthenticated, createGroup);

groupRouter.route("/groups").get(isAuthenticated, getAllGroups);

groupRouter.route("/group/:id").get(isAuthenticated, getGroupById);
