import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  createdAt: { type: Date, default: Date.now() },
  birthDate: { type: Date, required: true },
  age: { type: Number },
  linkGithub: { type: String, trim: true },
  linkGamerProfile: { type: String, trim: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  favoriteGames: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  likeGames: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  likeReviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  avatar: {
    type: String,
    default: "https://www.promoview.com.br/uploads/images/unnamed%2819%29.png",
  },
  userLevel: { type: Number },
  userExp: { type: Number },
});

export const UserModel = model("User", userSchema);
