import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: false,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    stakeAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    totalStake: {
        type: Number,
        required: true,
        default: 0,
    },
    result: [
        {
            type: Number,
            required: false,
        }
    ],
    endAt: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Game = mongoose.model("Game", gameSchema);

export default Game;