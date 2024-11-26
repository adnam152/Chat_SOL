import Bet from "../models/bet.model.js";
import Game from "../models/game.model.js";
import Chat from "../models/chat.model.js";
import { getSocketIds, io } from "../socket/socket.js";

const TIME_TO_RESULT = 30000;

export async function getGame(req, res) {
    try {
        const chatId = req.params.chatId;
        const games = await Game.find({ chatId });
        if (!games) {
            return res.status(404).json({ message: "Game not found" });
        }
        const game = games.filter(game => game.endAt > Date.now())[0];
        if (!game) return res.status(404).json({ message: "No game is available" });
        const data = {
            chatId: game.chatId,
            creatorId: game.creatorId,
            stakeAmount: game.stakeAmount,
            participants: game.participants,
            endAt: game.endAt,
        }
        res.status(200).json({ data });
    } catch (error) {
        console.log("Error Game Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createGame(req, res) {
    try {
        const userId = req.user._id;
        const chatId = req.body.chatId;
        // Check if owner of chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (chat.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not the owner of this chat" });
        }

        const stakeAmount = req.body.stakeAmount;
        // random 3 numbers [1-6]
        const result = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
        const game = new Game({
            chatId,
            creatorId: userId,
            stakeAmount,
            result,
            endAt: Date.now() + TIME_TO_RESULT,
        });
        await game.save();
        // Return game data = {chatId, creatorId, stakeAmount, participants, status}
        const data = {
            _id: game._id,
            chatId: game.chatId,
            creatorId: game.creatorId,
            stakeAmount: game.stakeAmount,
            participants: game.participants,
            endAt: game.endAt,
        }
        res.status(201).json({ data });

        // SOCKET
        const socketIds = getSocketIds(chat.members);
        if (socketIds.length > 0) {
            socketIds.forEach(socketId => {
                io.to(socketId).emit('newGame', { game });
            });
        }

    } catch (error) {
        console.log("Error Game Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function betting(req, res) {
    try {
        const userId = req.user._id;
        const gameId = req.body.gameId;
        const game = await Game.findOne({ _id: gameId });
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        if (game.endAt < Date.now()) {
            return res.status(400).json({ message: "Game is already ended" });
        }
        const bet = req.body.bet;
        // bet = {option: count}
        // Check if user has enough balance and minimum stake
        let sum = 0;
        for (const key in bet) {
            sum += bet[key];
        }
        sum *= game.stakeAmount;
        if (sum > req.user.gold) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        // Update user balance
        req.user.gold -= sum;
        await req.user.save();
        // Update game total stake
        game.totalStake += sum;
        await game.save();
        // Create bet
        const bets = [];
        for (const key in bet) {
            const newBet = new Bet({
                gameId,
                userId,
                option: key,
                count: bet[key],
                stake: bet[key] * game.stakeAmount,
            });
            await newBet.save();
            bets.push(newBet);
        }
        res.status(201).json({ data: bets, message: "Bet created successfully" });
    } catch (error) {
        console.log("Error Game Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const resultUpdated = {};
export async function getResult(req, res) {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findOne({ _id: gameId });

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        if (new Date(game.endAt) > Date.now()) {
            return res.status(400).json({ message: "Game is not ended yet" });
        }
        
        res.status(200).json({
            message: "Get result successfully",
            data: game.result,
        });

        if (resultUpdated[gameId]) return;
        // Tính kết quả
        const results = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        for (let i = 0; i < game.result.length; i++) {
            results[game.result[i]]++;
        }

        // Lấy danh sách cược
        const bets = await Bet.find({ gameId: gameId });

        // Tính phần thưởng
        let totalReward = 0;
        for (let i = 0; i < bets.length; i++) {
            const bet = bets[i];
            if (results[bet.option]) {
                const reward = bet.stake * 2;
                bet.reward = reward;
                totalReward += reward;

                // Cập nhật `reward` trong MongoDB
                await Bet.updateOne(
                    { _id: bet._id },
                    { $set: { reward: bet.reward } }
                );
            }
        }

        // Cập nhật vàng của người dùng
        req.user.gold += totalReward;
        await req.user.save();

        resultUpdated[gameId] = true;

    } catch (error) {
        console.log("Error Game Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
