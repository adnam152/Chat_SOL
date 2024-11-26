import Bet from "../models/bet.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { getSocketIds, io } from "../socket/socket.js";

export const getBets = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const bets = await Bet.find({ chatId });
        res.status(200).json({ data: bets });
    }
    catch (error) {
        console.log("Error Bet Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBetDetail = async (req, res) => {
    try {
        const betId = req.params.betId;
        const bet = await Bet.findById(betId);
        if (!bet) {
            return res.status(404).json({ message: "Bet not found" });
        }
        res.status(200).json({ data: bet });
    }
    catch (error) {
        console.log("Error Bet Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createBet = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, title, description, currency, options } = req.body;
        const bet = new Bet({
            chatId,
            title,
            description,
            options,
            creatorId: userId,
            status: "open",
        });
        await bet.save();
        // Create notification
        const message = new Message({
            chatId,
            senderId: userId,
            content: `created bet: ${title}`,
            isNotification: true,
        })
        message.save();
        const populatedMessage = await message.populate("senderId", "fullname");
        res.status(201).json({ data: bet });

        // Socket
        const chat = await Chat.findOne({ _id: chatId });
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('newBet', {
                    bet,
                    chatId
                });
                io.to(socketId).emit('newMessage', {
                    message: populatedMessage,
                    chatId
                });
            });
        }

    }
    catch (error) {
        console.log("Error Bet Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createBetDetail = async (req, res) => {
    try {
        const userId = req.user._id;
        const betId = req.params.betId;
        const { option, amount } = req.body;
        const bet = await Bet.findById(betId);
        if (!bet) {
            return res.status(404).json({ message: "Bet not found" });
        }
        if (bet.status === "closed") {
            return res.status(400).json({ message: "Bet is closed" });
        }
        if (bet.options.indexOf(option) === -1) {
            return res.status(400).json({ message: "Invalid option" });
        }
        const participant = bet.participants.find(participant => participant.userId.toString() === userId.toString());
        if (participant) {
            return res.status(400).json({ message: "You have already participated in this bet" });
        }
        bet.participants.push({
            userId,
            option,
            amount,
            requestedWithdraw: false,
        });
        bet.totalStake += amount;
        await bet.save();
        // Create notification
        const message = new Message({
            chatId: bet.chatId,
            senderId: userId,
            content: `participated in bet: ${bet.title}`,
            isNotification: true,
        })
        message.save();
        const populatedMessage = await message.populate("senderId", "fullname");
        res.status(201).json({ data: bet });

        // Socket
        const chat = await Chat.findOne({ _id: bet.chatId });
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('newVote', {
                    bet,
                    chatId: bet.chatId
                });
                io.to(socketId).emit('newMessage', {
                    message: populatedMessage,
                    chatId: bet.chatId
                });
            });
        }

    }
    catch (error) {
        console.log("Error Bet Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const closeBet = async (req, res) => {
    try {
        const betId = req.params.betId;
        const userId = req.user._id;
        const option = req.body.option;
        const bet = await Bet.findById(betId);
        if (!bet) {
            return res.status(404).json({ message: "Bet not found" });
        }
        if (bet.creatorId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to close this bet" });
        }
        if (bet.status === "closed") {
            return res.status(400).json({ message: "Bet is already closed" });
        }
        if (bet.options.indexOf(option) === -1) {
            return res.status(400).json({ message: "Invalid option" });
        }
        bet.status = "closed";
        bet.result = option;
        await bet.save();
        // Create notification
        const message = new Message({
            chatId: bet.chatId,
            senderId: userId,
            content: `closed bet: ${bet.title}`,
            isNotification: true,
        });
        message.save();
        const populatedMessage = await message.populate("senderId", "fullname");
        res.status(200).json({ data: bet });

        // Socket
        const chat = await Chat.findOne({ _id: bet.chatId });
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('closeBet', {
                    bet,
                    chatId: bet.chatId
                });
                io.to(socketId).emit('newMessage', {
                    message: populatedMessage,
                    chatId: bet.chatId
                });
            });
        }
    }
    catch (error) {
        console.log("Error Bet Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
