import express, { Request, Response } from "express";
import pool from "../db";

interface Payload {
  id: string;
  photo: string;
  message: string;
  logType: string;
  date: string;
}

const router = express.Router();

router.get("/notifications/:id", async (req: Request, res: Response) => {
  req.log4u?.log({message:"Request entered GET --> NotificationById"})
  try {
    const likeMessages = await pool.query(
      "SELECT * FROM Notification WHERE id = $1",
      [req.params.id]
    );
    const likes: Payload[] = likeMessages.rows;
    req.log4u?.log({type:"DEBUG", message: "NotificationById handler processed successfully", statusCode: 200})
    res.status(200).json(likes);
  } catch (error) {
    req.log4u?.log({type:"ERROR", message: error, statusCode: 500})
    res.status(500).json(error);
  }
});

export default router;
