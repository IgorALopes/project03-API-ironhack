import express from "express";
import { generateToken } from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { UserModel } from "../model/user.model.js";

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

// User Singup
userRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

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
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User update
userRouter.put("/:id", async (req, res) => {
  try {
    const editUser = await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(editUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// User delete
userRouter.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await UserModel.deleteOne({ _id: req.params.id });

    return res.status(200).json(deletedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.get(
  "/teste",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    return res.status(200).json(req.currentUser);
  }
);

export { userRouter };
