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

// Read all games
gameRouter.get("/games", async (req, res) => {
  try {
    const allGames = await GameModel.find();

    return res.status(200).json(allGames);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Read one game

gameRouter.get("/:id", attachCurrentUser, async (req, res) => {
  try {
    const game = await GameModel.findOne({ _id: req.params.id });

    return res.status(200).json(game);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { gameRouter };
