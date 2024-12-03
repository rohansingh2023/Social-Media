import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import NotificationRouter from "./events";
import { addLike } from "./events/like";
import { addComment } from "./events/comment";
import { addFriend } from "./events/friend";
import { Logger } from "log4u";
import { log4uMiddleware } from "./middleware/logging";

const app = express();

app.use(cors());
app.use(express.json());
app.use(log4uMiddleware)

const log4u = new Logger({serviceName:"Notification"})

addLike(log4u);
addComment(log4u);
addFriend(log4u);

app.use("/api", NotificationRouter);

app.listen(6005, () => {
  log4u.log({message:"Started Notifications service..."})
  log4u.log({message:"Notification server listening on port: 6005"})
  console.log(`Notification server listening on port: 6005`);
});
