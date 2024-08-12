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

interface User {
  userId: string;
  name: string;
  email: string;
  profilePic: string;
  socketId: string;
}

let onlineUsers: User[] = [];

const addNewUser = (
  userId: string,
  name: string,
  email: string,
  profilePic: string,
  socketId: string
) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, name, email, profilePic, socketId });
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

io.on(
  "connection",
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    // / When a user logs in, they emit this event
    socket.on("login", ({ userId, name, email, profilePic }) => {
      console.log(`${name} logged in`);
      addNewUser(userId, name, email, profilePic, socket.id);
      console.log(onlineUsers);

      io.emit("getUsers", onlineUsers);
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
      console.log("User disconnected: ", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", onlineUsers);
    });
  }
);

server.listen(8900, () => {
  console.log("Web Socket connecting running at Port: 8900");
});
