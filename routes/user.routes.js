import express from "express";
import { generateToken } from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { UserModel } from "../model/user.model.js";

import bcrypt from "bcrypt";
import { gameRouter } from "./game.routes.js";
import { GameModel } from "../model/game.model.js";
import { ReviewModel } from "../model/review.model.js";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

// User Signup
userRouter.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { password } = req.body;
    console.log(password)
    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);
    
    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;
    return res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, email, password)

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User Read
userRouter.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    const userData = await UserModel.findOne({ _id: loggedUser._id })
      .populate("games")
      .populate("reviews")
      .populate("favoriteGames");

    return res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Read All users
userRouter.get(
  "/users",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const allUsers = await UserModel.find({});
      return res.status(200).json(allUsers);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// User update
userRouter.put("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    if (
      String(loggedUser._id) === req.params.id ||
      loggedUser.role === "USER"
    ) {
      const editUser = await UserModel.findByIdAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(editUser);
    } else {
      return res.status(401).json({ msg: "User unauthorized." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//User Admin role
userRouter.put(
  "/att-role/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const newAdm = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { role: "ADMIN" },
        { new: true, runValidators: true }
      );

      return res.status(200).json(newAdm);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// User delete
userRouter.delete("/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;
    const allGames = await GameModel.find().populate("reviews");

    if (
      String(loggedUser._id) === req.params.id ||
      loggedUser.role === "ADMIN"
    ) {
      // delete all user reviews from games

      allGames.forEach(async (currentKey) => {
        currentKey.reviews.forEach(async (currentReview) => {
          if (String(currentReview.owner) === req.params.id) {
            await GameModel.findOneAndUpdate(
              { _id: currentReview.game },
              { $pull: { reviews: currentReview._id } }
            );
          }
        });
      });

      // delete all user likes from games
      loggedUser.likeGames.forEach(async (current) => {
        await GameModel.findOneAndUpdate(
          { _id: current },
          { $pull: { userLikeThis: loggedUser._id } }
        );
      });

      // delete all user favorites from games
      loggedUser.favoriteGames.forEach(async (current) => {
        await GameModel.findOneAndUpdate(
          { _id: current },
          { $pull: { userFavoriteGame: loggedUser._id } }
        );
      });

      // delete all user likes from review
      loggedUser.likeReviews.forEach(async (current) => {
        await ReviewModel.findOneAndUpdate(
          { _id: current },
          { $pull: { userLikeThis: loggedUser._id } }
        );
      });

      //  delete all user reviews
      loggedUser.reviews.forEach(async (current) => {
        await ReviewModel.deleteOne({ _id: current });
      });

      // delete all user games
      loggedUser.games.forEach(async (current) => {
        await GameModel.deleteOne({ _id: current });
      });

      // delete user
      const deletedUser = await UserModel.deleteOne({ _id: req.params.id });

      return res.status(200).json(deletedUser);
    } else {
      return res.status(401).json({ msg: "User unauthorized." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { userRouter };
