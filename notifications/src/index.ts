import express from "express";
import cors from "cors";
import NotificationRouter from "./events";
import { addLike } from "./events/like";
import { addComment } from "./events/comment";
import { addFriend } from "./events/friend";

const app = express();

app.use(cors());
app.use(express.json());

addLike();
addComment();
addFriend();

app.use("/api", NotificationRouter);

app.listen(6005, () => {
  console.log(`Notification server listening on port: 6005`);
});
