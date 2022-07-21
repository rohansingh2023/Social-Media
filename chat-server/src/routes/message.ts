import express from "express";
import { addMessage, getAMessage } from "../controllers/message";

const router = express.Router();

router.post("/", addMessage);

router.get("/:conversationId", getAMessage);

export default router;
