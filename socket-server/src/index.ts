import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import cors from "cors";

const app = express();

app.use(cors());
// app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users: any[] = [];

const addUser = (userId: any, socketId: any) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: any) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: any) => {
  return users.find((user) => user.userId === userId);
};

io.on(
  "connection",
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    console.log("User connected: ", socket.id);

    socket.on("join_chat", () => {
      console.log(`User connected with id: ${socket.id}`);
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
      console.log("User disconnected: ", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  }
);

server.listen(8900, () => {
  console.log("Web Socket connecting running at Port: 8900");
});
