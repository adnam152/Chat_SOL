import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    option: { // 1, 2, 3, 4, 5, 6
        type: Number,
        required: true,
    },
    count: { //Số lần đặt cược
        type: Number,
        required: true,
    },
    stake: { // Tổng số tiền cược của option này
        type: Number,
        required: true,
    },
    reward: {
        type: Number,
        required: false,
        default: 0,
    },
}, {timestamps: true});

const Bet = mongoose.model("Bet", betSchema);

export default Bet;