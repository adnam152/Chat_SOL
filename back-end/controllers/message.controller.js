import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { getSocketIds, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const senderId = req.user._id;
        const chatId = req.params.chatId;

        if (!content || !senderId) return res.status(400).json({ message: "All fields are required" });

        const message = new Message({
            chatId,
            content,
            senderId,
            isNotification: req.isNoti
        });
        if (!message) return res.status(400).json({ message: "Message could not be created" });

        await message.save();

        const populatedMessage = await message.populate("senderId", "avatar fullname");

        if (!req.isNoti) res.status(201).json({ data: populatedMessage });

        // SOCKET
        const chat = await Chat.findOne({ _id: chatId });
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('newMessage', {
                    message: populatedMessage,
                    chatId
                });
            });
        }

    }
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id;
        const chatId = req.params.chatId;

        // Check if user is a member of the Chat
        const isMember = await Chat.findOne({ _id: chatId, members: senderId });
        if (!isMember) return res.status(401).json({ message: "Unauthorized" });

        const messages = await Message.find({ chatId }).sort({ createdAt: -1 })
            .populate("senderId", "username avatar fullname");
        if (!messages) return res.status(404).json({ message: "Messages not found" });

        res.status(200).json({ data: messages });
    }
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { sendMessage, getMessages };