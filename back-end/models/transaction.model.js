import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blockhash: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    amount: { //SOL
        type: Number,
        required: true,
    },
    isSucceed: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;