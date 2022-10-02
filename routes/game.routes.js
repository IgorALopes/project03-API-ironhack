import express from "express";
import { GameModel } from "../model/game.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const gameRouter = express.Router();

//Create game
gameRouter.post("/new-game", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const createdGame = await GameModel.create(req.body);

    return res.status(200).json(createdGame);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { gameRouter };
