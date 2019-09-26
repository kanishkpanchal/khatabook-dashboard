import { ImageObj } from "../models/image";
import { UserImage } from "../models/userImage";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { VideoObj } from "../models/video";
const uuid = require('uuid/v1');

const JWT_SECRET = process.env.JWT_SECRET;

import express from "express";
const router = express.Router();

// Get all images
router.get('/', async (req, res, next) => {
    try{
        const options = req.query;
        let images;

        console.log(options);

        if (options.startDate && options.endDate) {
            images = await ImageObj
                        .find({ createdAt: {$gte: options.startDate , $lte: options.endDate}})
                        .sort({createdAt: -1})
                        .populate('uploadedBy');
        } else {
            images = await ImageObj.find({}).sort({createdAt: -1}).populate('uploadedBy');
        }

        res.json({
            data: {
                images
            },
            success: true,
            status: "success",
            message: ""        
        });
        
    } catch (err) {
        res.status(500).json({
            status: "failed",
            success: false,
            message: 'Something went wrong!'
        });
    }
});


export default router;