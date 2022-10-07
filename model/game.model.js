import { Schema, model } from "mongoose";

const gameSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now() },
  title: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  esrb: {
    type: String,
    enum: [
      ,"Everyone",
      "Everyone 10+",
      "Teen 13+",
      "Mature 17+",
      "Adults Only 18+"
    ],
    required: true,
  },
  linkDeploy: { type: String, trim: true, required: true },
  linkRepo: [{ type: String, trim: true }],
  description: { type: String, required: true },
  gameLogo: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2016/12/23/07/00/game-1926906__340.png",
  },
  screenShots: [
    {
      type: String,
      default:
        "https://www.promoview.com.br/https://tanabi.sp.gov.br/lib/img/no-image.jpg/images/unnamed%2819%29.png",
    },
  ],
  userLikeThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  userFavoriteGame: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const GameModel = model("Game", gameSchema);
