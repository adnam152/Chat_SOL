import express from "express";
import {getGame, createGame, betting, getResult } from "../controllers/game.controller.js";

const router = express.Router();

router.get('/get/:chatId', getGame);

router.post('/create', createGame);

router.post('/bet', betting);

router.get('/result/:gameId', getResult);

export default router;