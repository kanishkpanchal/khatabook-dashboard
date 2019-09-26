import mongoose from "mongoose";
import { User } from "./user";

const imageSchema = new mongoose.Schema({
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
    xCoordinate: {
        type: Number,
        default: 0.5
    },
    yCoordinate: {
        type: Number,
        default: 0.875
    },
    hexColorCode: {
        type: String,
        default: "#aeaeae"
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, { timestamps: true });

export const ImageObj = mongoose.model("ImageObj", imageSchema);
