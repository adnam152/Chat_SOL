import express from "express";
import { closeBet, createBetDetail, getBets, getBetDetail, createBet } from "../controllers/bet.controller.js";

const router = express.Router();

router.get('/:chatId', getBets);

router.get('/detail/:betId', getBetDetail);

router.post('/detail/:betId', createBetDetail);

router.post('/create', createBet);

router.put('/close/:betId', closeBet);

router.post('phantom', async (req, res) => {
    const { publicKey, amount, poolId, option } = req.body;

    try {
        // Gọi API của GameShift để thêm giao dịch đặt cược
        const response = await fetch("https://api.gameshift.io/bet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GAMESHIFT_API_KEY}`,
            },
            body: JSON.stringify({
                publicKey,
                poolId,
                option,
                amount,
            }),
        });

        if (!response.ok) throw new Error("Failed to process bet");

        res.status(200).json({ message: "Bet placed successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;