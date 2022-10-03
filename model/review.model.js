import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  game: { type: Schema.Types.ObjectId, ref: "Game" },
  createdAt: { type: Date, default: Date.now() },
  rates: {
    graphics: { type: Number, required: true },
    soundEffects: { type: Number, required: true },
    playability: { type: Number, required: true },
    fun: { type: Number, required: true },
    replayability: { type: Number, required: true },
  },
  userEvaluation: { type: String },
  userLikesThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const ReviewModel = model("Review", reviewSchema);
