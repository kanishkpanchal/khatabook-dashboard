import mongoose from "mongoose";
import { User } from "./user";

const videoSchema = new mongoose.Schema({
    url: {
        type: String, 
        required: true
    },
    name: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String]
    },
    thumbnail: {
        type: String,
        default: "https://khatabook-videos.s3.ap-south-1.amazonaws.com/default_thumbnail.jpeg"
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, { timestamps: true });

export const VideoObj = mongoose.model("videoObj", videoSchema);
