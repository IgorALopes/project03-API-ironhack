import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    game: { type: Schema.Types.ObjectId, ref: "Game" },

    
});

export const ReviewModel = model("Review", reviewSchema);