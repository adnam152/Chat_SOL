import express from "express";
import { getConversationForSideBar } from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", getConversationForSideBar);

export default router;