import Chat from "../models/chat.model.js";
import { sendMessage } from "./message.controller.js";
import { getSocketIds, io } from "../socket/socket.js";

export const createGroupChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatName = req.body.name;
        const chat = new Chat({
            chatName,
            ownerId: userId,
            members: [userId],
        });
        await chat.save();
        res.status(201).json({ data: chat });
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ members: userId }).sort({ updatedAt: -1 });
        res.status(200).json({ data: chats });
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const joinChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatId = req.body.id;
        const chat = await Chat.findById(chatId);
        // console.log('Find chat', chatId, chat);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (chat.members.includes(userId)) {
            return res.status(400).json({ message: "User already in chat" });
        }
        chat.members.push(userId);
        await chat.save();
        res.status(200).json({ data: chat });

        // create message
        req.body.content = "joined the chat";
        req.params.chatId = chatId;
        req.isNoti = true;
        sendMessage(req, res);

        // SOCKET
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('updateMember', { chat });
            });
        }

    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        // console.log('Delete chat', chat.ownerId, userId);
        if (chat.ownerId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await Chat.findByIdAndDelete(chatId);
        res.status(200).json({ data: { _id: chatId }, message: "Chat deleted" });
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const leaveChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatId = req.body.id;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (chat.ownerId.toString() === userId.toString()) {
            return res.status(400).json({ message: "Owner cannot leave chat" });
        }
        chat.members = chat.members.filter(member => member.toString() !== userId.toString());
        await chat.save();
        res.status(200).json({ data: { _id: chatId }, message: "User left chat" });

        // create message
        req.body.content = "left the chat";
        req.params.chatId = chatId;
        req.isNoti = true;
        sendMessage(req, res);

        // SOCKET
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('updateMember', { chat });
            });
        }
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMembers = async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId).populate("members", "avatar username fullname");
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.status(200).json({ data: chat.members });
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeMember = async (req, res) => {
    try {
        const chatId = req.body.chatId;
        const memberId = req.body.memberId;
        if (memberId === req.user._id) {
            return res.status(400).json({ message: "Cannot remove yourself" });
        }
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (chat.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        chat.members = chat.members.filter(member => member.toString() !== memberId);
        await chat.save();
        res.status(200).json({ data: memberId });
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}