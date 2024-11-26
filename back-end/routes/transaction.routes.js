import express from "express";
import { createTransaction, verifyTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);

router.post('/verify', verifyTransaction);



export default router;