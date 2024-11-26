import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isNotification: { // true if this message is a notification
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

const message = mongoose.model("Message", messageSchema);

export default message;