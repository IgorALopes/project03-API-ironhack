import express from "express";
import { GameModel } from "../model/game.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const gameRouter = express.Router();

export { gameRouter };
