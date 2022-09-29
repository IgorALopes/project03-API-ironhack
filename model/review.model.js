import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    esrb: { type: String, enum: ["Everyone", "Everyone 10+", "Teen 13+", "Mature 17+", "Adults Only 18+"], default: "Everyone" },
    linkDeploy: { type: String, trim: true },
    linkGithubRepo: { type: String, trim: true },
    description: { type: String },
    cover: {
        type: String,
        default: "https://img.freepik.com/vetores-gratis/padrao-de-meio-tom-quadrado-aleatorio_1409-1062.jpg?w=996&t=st=1664402888~exp=1664403488~hmac=60c1114dee156c3d1728b21c584e2776d2369bab99a79549c46930a3f4c335b9",
      },
    gameLogo: {
        type: String,
        default: "https://cdn.https://cdn.pixabay.com/photo/2017/06/10/07/15/joystick-2389216_960_720.pngpixabay.com/photo/2016/12/23/07/00/game-1926905_960_720.png",
      },
    screenShots: [{
        type: String,
        default: "https://www.promoview.com.br/https://tanabi.sp.gov.br/lib/img/no-image.jpg/images/unnamed%2819%29.png",
      }],
    rates: [
        { graphics: { type: Number } },
        { soundEffects: { type: Number } },
        { playability: { type: Number } },
        { fun: { type: Number } },
        { replayability: { type: Number } },
    ],
    userLikeThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
});

export const ReviewModel = model("Review", reviewSchema);