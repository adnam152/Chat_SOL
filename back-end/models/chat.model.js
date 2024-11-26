import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true});

const chat = mongoose.model("Chat", chatSchema);

export default chat;