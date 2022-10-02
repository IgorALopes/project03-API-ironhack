import express from "express";
import { GameModel } from "../model/game.model.js";
import isAuth from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const reviewRouter = express.Router();

export { reviewRouter };
