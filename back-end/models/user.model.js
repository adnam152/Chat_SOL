import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    gold: {
        type: Number,
        default: 1000,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dzkdgm4c7/image/upload/v1731945251/DATN/rxkmkxsqet6xrc2sllry.jpg",
    },
}, {timestamps: true});


const user = mongoose.model("User", userSchema);

export default user;