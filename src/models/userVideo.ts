import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userVideoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    isLiked: {
        type: Boolean,
        default: false
    }
});

export const UserVideo = mongoose.model("UserVideo", userVideoSchema);
