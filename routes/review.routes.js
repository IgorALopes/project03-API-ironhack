import express from "express";
import { ReviewModel } from "../model/review.model.js";
import { UserModel } from "../model/user.model.js";
import { GameModel } from "../model/game.model.js";
import isAuth from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const reviewRouter = express.Router();

// Create review
reviewRouter.post("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    const createdReview = await ReviewModel.create({
      ...req.body,
      owner: loggedUser._id,
      game: req.params.id,
    });

    await UserModel.findOneAndUpdate(
      { _id: loggedUser._id },
      { $push: { reviews: createdReview.id } }
    );

    await GameModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reviews: createdReview._id } }
    );

    return res.status(200).json(createdReview);
  } catch (err) {
    console.log(err);
    ß;
    return res.status(500).json(err);
  }
});

// Read one review
reviewRouter.get("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id })
      .populate("owner")
      .populate("game");

    return res.status(200).json(review);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//  Update review
reviewRouter.put("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const review = await ReviewModel.findOne({ _id: req.params.id });
    console.log(String(loggedUser._id));
    console.log(String(review.owner._id));
    console.log(loggedUser.role);

    if (
      String(loggedUser._id) === String(review.owner._id) ||
      loggedUser.role === "ADMIN"
    ) {
      const editReview = await ReviewModel.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json(editReview);
    } else {
      return res.status(401).json({ msg: "User unauthorized." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User like the review
reviewRouter.patch("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const review = await ReviewModel.findOne({ _id: req.params.id });

    if (review.userLikeThis.includes(loggedUser._id)) {
      await ReviewModel.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { userLikeThis: loggedUser._id } }
      );

      await UserModel.findOneAndUpdate(
        { _id: loggedUser._id },
        { $pull: { likeReviews: game._id } }
      );

      return res.status(200).json(review);
    }
    const userLike = await ReviewModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { userLikeThis: loggedUser._id } }
    );

    await UserModel.findOneAndUpdate(
      { _id: loggedUser._id },
      { $push: { likeReviews: review._id } }
    );

    return res.status(200).json(userLike);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Delete review
reviewRouter.delete(
  "/:id",
  isAuth,
  attachCurrentUser,

  async (req, res) => {
    console.log(req);
    try {
      const loggedUser = req.currentUser;
      const review = await ReviewModel.findOne({ _id: req.params.id });

      if (
        String(loggedUser._id) === String(review.owner._id) ||
        loggedUser.role === "ADMIN"
      ) {
        await GameModel.findOneAndUpdate(
          { _id: review.game },
          { $pull: { reviews: req.params.id } }
        );

        await UserModel.findOneAndUpdate(
          { _id: review.owner },
          { $pull: { reviews: req.params.id } }
        );

        const deletedReview = await ReviewModel.deleteOne({
          _id: req.params.id,
        });

        return res.status(200).json(deletedReview);
      } else {
        return res.status(401).json({ msg: "User unauthorized" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { reviewRouter };
