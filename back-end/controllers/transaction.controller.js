import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import dotenv from 'dotenv';
import TransactionModel from "../models/transaction.model.js";
import User from "../models/user.model.js";

// Solana Connection
const connection = new Connection("https://api.devnet.solana.com");

// Wallet Address từ .env
dotenv.config();
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const EXCHANGE_RATE = process.env.EXCHANGE_RATE;
if (!WALLET_ADDRESS) {
    throw new Error("Wallet address is not set in .env");
}
const recipientPublicKey = new PublicKey(WALLET_ADDRESS);


export async function createTransaction(req, res) {
    const userId = req.user._id;
    try {
        const { amountSOL, senderPublicKey } = req.body;
        if (!amountSOL || !senderPublicKey) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        // Lấy blockhash mới nhất từ mạng Solana
        const { blockhash } = await connection.getLatestBlockhash("finalized");

        const senderPublicKeyObj = new PublicKey(senderPublicKey);
        const transaction = new Transaction({
            recentBlockhash: blockhash, // Thêm blockhash
            feePayer: senderPublicKeyObj, // Phí giao dịch sẽ được trả bởi người gửi
        }).add(
            SystemProgram.transfer({
                fromPubkey: senderPublicKeyObj,
                toPubkey: recipientPublicKey,
                lamports: amountSOL * 1e9, // Chuyển đổi SOL sang lamports
            })
        );

        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
        });

        // Lưu blockhash để xác minh giao dịch sau này
        TransactionModel.create({
            userId,
            blockhash,
            type: "buy gold",
            amount: amountSOL,
            isSucceed: false,
        });

        res.status(200).json({
            transactionData: serializedTransaction.toString("base64"),
            blockhash
        });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function verifyTransaction(req, res) {
    try {
        const userId = req.user._id;
        const { txId, blockhash } = req.body;
        if (!txId) {
            return res.status(400).json({ message: "Missing transaction ID" });
        }

        const transactionResult = await connection.getTransaction(txId, {
            commitment: "confirmed",
        });

        if (!transactionResult) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const { transaction } = transactionResult;
        const { message } = transaction;

        const transactionModel = await TransactionModel.findOne({
            userId,
            blockhash,
            isSucceed: false,
        });

        if (!transactionModel) {
            throw new Error("Blockhash not found! Transaction is invalid.");
        }

        // Xác minh recentBlockhash
        if (message.recentBlockhash !== blockhash) {
            throw new Error("Blockhash mismatch! Transaction is invalid.");
        }

        // Xác minh giao dịch
        if (transactionResult.meta && transactionResult.meta.err === null) {
            // Cập nhật trạng thái giao dịch
            transactionModel.isSucceed = true;
            await transactionModel.save();
            // Cộng gold cho user
            const user = await User.findById(userId);
            user.gold += transactionModel.amount * EXCHANGE_RATE;
            await user.save();
            return res.status(200).json({ user });
        }

        console.log("Transaction failed:", txId);
        res.status(400).json({ success: false, message: "Transaction failed" });
    } catch (error) {
        console.error("Error verifying transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}