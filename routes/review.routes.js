import express from "express";
import { ReviewModel } from "../model/review.model.js";
import isAuth from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const reviewRouter = express.Router();

// Create review
reviewRouter.post("/", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const createdReview = await ReviewModel.create(req.body);

    return res.status(200).json(createdReview);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Read one review
reviewRouter.get("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id });

    return res.status(200).json(review);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//  Update review
reviewRouter.put(
  "/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const editReview = await ReviewModel.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(editReview);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// Delete review
reviewRouter.delete(
  "/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const deletedReview = await ReviewModel.deleteOne({ _id: req.params.id });

      return res.status(200).json(deletedReview);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { reviewRouter };
