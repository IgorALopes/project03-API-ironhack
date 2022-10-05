import express from "express";
import { GameModel } from "../model/game.model.js";
import { UserModel } from "../model/user.model.js";
import { ReviewModel } from "../model/review.model.js";
import isAuth from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const gameRouter = express.Router();

//Create game
gameRouter.post("/new-game", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    const game = await GameModel.create({
      ...req.body,
      owner: loggedUser._id,
    });

    await UserModel.findOneAndUpdate(
      { _id: loggedUser._id },
      { $push: { games: game._id } }
    );

    return res.status(201).json(game);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Read all games
gameRouter.get("/games", async (req, res) => {
  try {
    const allGames = await GameModel.find().populate("owner");

    return res.status(200).json(allGames);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Read one game
gameRouter.get("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const game = await GameModel.findOne({ _id: req.params.id })
      .populate("reviews")
      .populate("owner");

    return res.status(200).json(game);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Update game
gameRouter.put("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const game = await GameModel.findOne({ _id: req.params.id });

    if (
      String(loggedUser._id) === String(game.owner._id) ||
      loggedUser.role === "ADMIN"
    ) {
      const editGame = await GameModel.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json(editGame);
    } else {
      return res.status(401).json({ msg: "User unauthorized." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User favorite the game
gameRouter.patch("/fav/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const game = await GameModel.findOne({ _id: req.params.id });

    if (game.userFavoriteGame.includes(loggedUser._id)) {
      await GameModel.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { userFavoriteGame: loggedUser._id } }
      );

      await UserModel.findOneAndUpdate(
        { _id: loggedUser._id },
        { $pull: { favoriteGames: game._id } }
      );

      return res.status(200).json(game);
    }
    const userFavorite = await GameModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { userFavoriteGame: loggedUser._id } }
    );

    await UserModel.findOneAndUpdate(
      { _id: loggedUser._id },
      { $push: { favoriteGames: game._id } }
    );

    return res.status(200).json(userFavorite);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User like the game
gameRouter.patch("/like/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const game = await GameModel.findOne({ _id: req.params.id });

    if (game.userLikeThis.includes(loggedUser._id)) {
      await GameModel.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { userLikeThis: loggedUser._id } }
      );

      await UserModel.findOneAndUpdate(
        { _id: loggedUser._id },
        { $pull: { likeGames: game._id } }
      );

      return res.status(200).json(game);
    }
    const userLike = await GameModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { userLikeThis: loggedUser._id } }
    );

    await UserModel.findOneAndUpdate(
      { _id: loggedUser._id },
      { $push: { likeGames: game._id } }
    );

    return res.status(200).json(userLike);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Delete game
gameRouter.delete("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const game = await GameModel.findOne({ _id: req.params.id });

    if (
      String(loggedUser._id) === String(game.owner._id) ||
      loggedUser.role === "ADMIN"
    ) {
      // Delete all game reviews
      game.reviews.forEach(async (current) => {
        await ReviewModel.deleteOne({ _id: current });
      });

      // delete the game from user
      await UserModel.findOneAndUpdate(
        { id: game.owner },
        { $pull: { games: req.params.id } }
      );

      // delete favorite game from user
      if (game.userFavoriteGame.includes(loggedUser._id)) {
        await UserModel.findOneAndUpdate(
          { id: game.owner },
          { $pull: { favoriteGames: req.params.id } }
        );
      }

      // delete game
      const deletedGame = await GameModel.deleteOne({ _id: req.params.id });
      return res.status(200).json(deletedGame);
    } else {
      return res.status(401).json({ msg: "User unauthorized." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { gameRouter };
