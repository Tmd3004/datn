import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { Dropbox } from "dropbox";
import fetch from "node-fetch";
import { isAdmin, isAuth } from "../utils.js";

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post("/", isAuth, upload.single("file"), async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

uploadRouter.post(
  "/upload-pdf",
  isAuth,
  upload.single("file"),
  async (req, res) => {
    const dbx = new Dropbox({
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
      fetch: fetch,
    });

    try {
      const result = await dbx.filesUpload({
        path: `/${req.file.originalname}`,
        contents: req.file.buffer,
      });

      const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
        path: `/${req.file.originalname}`,
      });

      res.status(200).send({
        name: result.result.name,
        url: sharedLinkResponse.result.url,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

export default uploadRouter;
