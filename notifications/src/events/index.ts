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
  try {
    const likeMessages = await pool.query(
      "SELECT * FROM Notification WHERE id = $1",
      [req.params.id]
    );
    const likes: Payload[] = likeMessages.rows;
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
