import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userImageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    imageId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    isLiked: {
        type: Boolean,
        default: false
    }
});

export const UserImage = mongoose.model("UserImage", userImageSchema);
