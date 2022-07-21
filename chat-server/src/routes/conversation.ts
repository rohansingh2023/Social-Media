import express from "express";
import {
  createConversation,
  getConversationOfAUser,
  getConversationOfTwoUsers,
} from "../controllers/conversation";

const router = express.Router();

router.post("/", createConversation);

router.get("/:userId", getConversationOfAUser);

router.get("/:firstUserId/:secondUserId", getConversationOfTwoUsers);

export default router;
