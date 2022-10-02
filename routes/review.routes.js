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

export { reviewRouter };
