import { uploadImg } from "../config/cloudinary.config.js";
import express from "express";

const uploadImgRouter = express.Router();

uploadImgRouter.post(
  "/uploadImage",
  uploadImg.single("pictures"),
  (req, res) => {
    if (!req.file) {
      console.log(req.file);
      return res.status(400).json({ msg: "Upload fail" });
    }

    return res.status(201).json({ url: req.file.path });
  }
);

export { uploadImgRouter };
