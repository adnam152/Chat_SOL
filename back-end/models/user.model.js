import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    fullname: {
        type: String,
        required: true,
    },
    gender : {
        type: String,
        required: true,
        enum : ['male', 'female']
    },
    profilePicture: {
        type: String,
        default: "",
    },
}, {timestamps: true});

const user = mongoose.model("User", userSchema);

export default user;