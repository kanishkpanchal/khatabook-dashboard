import express from "express";
import aws from "aws-sdk";
import jwt, { decode } from "jsonwebtoken";

import multerS3 from "multer-s3";
import multer from "multer";
import { ImageObj } from "../models/image";
import { VideoObj } from "../models/video";

const uuid = require("uuid/v1");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// const s3_base_url = `https://${bucketName}.s3.ap-south-1.amazonaws.com/`;

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1"
});

const checkToken = (req, res, next) => {
  const token = req.query.token;

  if (token) {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log("--------------Decoded Token --------------");
    console.log(decodedToken);
    req.body.decodedToken = decodedToken;
    next();
  } else {
    next("unauthorized");
  }
};

router.use(checkToken);

// All Dashboard Routes Listed here

router.get("/", (req, res) => {
  console.log("reached dashboard");
  const token = req.query.token;

  const decodedToken: any = req.body.decodedToken;

  res.render("dashboard", {
    flash: null,
    info: decodedToken,
    token: req.query.token
  });
});

const uploadVideo = multer({
  storage: multerS3({
    s3: s3,
    bucket: "khatabook-videos",
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, Object.assign({}, req.body));
    },
    key: function(req, file, cb) {
      cb(null, req.params.id + ".mp4");
    }
  })
});

const uploadImage = multer({
    storage: multerS3({
      s3: s3,
      bucket: "khatabook-images",
      acl: "public-read",
      metadata: function(req, file, cb) {
        cb(null, Object.assign({}, req.body));
      },
      key: function(req, file, cb) {
        cb(null, req.params.id + ".jpg");
      }
    })
  });

// Upload Image
router.post("/upload-image/:id", uploadImage.single("photo"),
  async (req, res) => {
    const bucketName = "khatabook-images";
    const decodedToken: any = jwt.decode(req.query.token);
    const uploadedBy = decodedToken.userId;

    console.log("user" + uploadedBy);

     await ImageObj.create({
        url: `https://${bucketName}.s3.ap-south-1.amazonaws.com/${req.params.id}.jpg`, 
        name: req.body.filename,
        xCoordinate: req.body.xCoordinate,
        yCoordinate: req.body.yCoordinate,
        hexColorCode: req.body.hexColorCode,
        uploadedBy
      });

    console.log("--------------Image Obj created --------------");

    res.redirect(`/dashboard?token=${req.query.token}&default=image`);
  }
);

router.post(
    "/upload-image-url/:id",

    uploadImage.single("photo"),
    async (req, res) => {
        const bucketName = "khatabook-images";
      const decodedToken: any = jwt.decode(req.query.token);
      const uploadedBy = decodedToken.userId;
      const urlTemp = req.body.url;

      console.log(urlTemp);
  
      console.log(uploadedBy);
  
        await ImageObj.create({
          url: urlTemp,
          name: req.body.filename,
          xCoordinate: req.body.xCoordinate,
          yCoordinate: req.body.yCoordinate,
          hexColorCode: req.body.hexColorCode,
          uploadedBy
        });
  
      console.log(req.body);
      console.log("--------------Image Obj created --------------");
  
      res.redirect(`/dashboard?token=${req.query.token}&default=image`);
    }
  );
 

router.post(
  "/upload-video/:id",
  uploadVideo.single("video"),
  async (req, res) => {
    const decodedToken: any = jwt.decode(req.query.token);
    const uploadedBy = decodedToken.userId;
    const bucketName = "khatabook-videos";
    await VideoObj.create({
      url: `https://${bucketName}.s3.ap-south-1.amazonaws.com/${req.params.id}.mp4`,
      name: req.body.filename,
      uploadedBy
    });

    res.redirect(`/dashboard?token=${req.query.token}&default=video`);
  }
);

router.post(
    "/upload-video-url/:id",
    uploadVideo.single("video"),
    async (req, res) => {

      const decodedToken: any = jwt.decode(req.query.token);
      const uploadedBy = decodedToken.userId;
      const bucketName = "khatabook-videos";
      console.log(req.body.videoUrl);

      await VideoObj.create({
        url: req.body.videoUrl,
        name: req.body.filename,
        uploadedBy
      });
  
      res.redirect(`/dashboard?token=${req.query.token}&default=video`);
    }
  );

export default router;
