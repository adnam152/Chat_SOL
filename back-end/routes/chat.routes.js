import express from "express";
import { removeMember, getMembers, createGroupChat, getChats, joinChat, deleteChat, leaveChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/get", getChats);

router.post("/create", createGroupChat);

router.post("/join", joinChat);

router.delete("/delete/:id", deleteChat);

router.post("/leave", leaveChat);

router.get("/members/:id", getMembers);

router.post("/remove-member", removeMember);

export default router;