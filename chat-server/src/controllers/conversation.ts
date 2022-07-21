import { Request, Response, NextFunction } from "express";
import Conversation from "../models/Conversation";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getConversationOfAUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getConversationOfTwoUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
};
