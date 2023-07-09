import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST"],
  },
});

let onlineUsers: any[] = [];

const addNewUser = (userId: any, socketId: any) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

io.on(
  "connection",
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    socket.on("join_chat", (data) => {
      addNewUser(data?.userId, socket.id);
      io.emit("userOnline", onlineUsers);
      console.log(onlineUsers);
      console.log(`User connected with id: ${data?.userId}`);
    });

    socket.on("sent_request", (data: any) => {
      console.log(
        `Friend Request sent to id: ${data.id} and name: ${data.name}`
      );
      socket.to(data.id).emit("friend_request", {
        res: data.cUser,
        message: `${data.cUser.name} sent you a friend Request`,
      });
    });

    socket.on("addUser", (data) => {
      socket.join(data?.room);
      console.log(`A user entered chat: ${data?.room}`);
    });

    socket.on(
      "sendMessage",
      ({ senderId, receiverId, text, conversationId, createdAt }) => {
        // const user = getUser(receiverId);
        socket.to(conversationId).emit("getMessage", {
          senderId,
          receiverId,
          text,
          conversationId,
          createdAt,
        });
        console.log(`Text:${text} from convId:${conversationId}`);
      }
    );

    socket.on("test", (data) => {
      socket.broadcast.emit("test2", data);
    });

    socket.on("disconnect", () => {
      // let i = onlineUsers.indexOf(socket.id);
      // onlineUsers.splice(i, 1, 0);
      removeUser(socket.id);
      io.emit("userOnline", onlineUsers);
      console.log("User disconnected: ", socket.id);
    });
  }
);

server.listen(8900, () => {
  console.log("Web Socket connecting running at Port: 8900");
});
