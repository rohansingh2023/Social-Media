import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  }
);

server.listen(8900, () => {
  console.log("Web Socket connecting running at Port: 8900");
});
