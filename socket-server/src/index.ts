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
  id: string;
  name: string;
  email: string;
  profilePic: string;
  socketId: string;
}

interface OnlineUser {
  [userId: string]: User;
}

let activeUsers: Map<string, { socketId: string }> = new Map();

let onlineUsers: OnlineUser = {};

io.on(
  "connection",
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    // / When a user logs in, they emit this event
    socket.on("login", ({ userId}) => {
      activeUsers.set(userId, { socketId: socket.id });
      console.log(`User ${userId} logged in with socket ID: ${socket.id}`);
      io.emit("onlineUsers", Array.from(activeUsers.entries()).map(([userId, userInfo]) => ({
        _id: userId,
        socketId: userInfo.socketId
      })));
    });

    // io.emit("getOnlineUsers", Object.values(onlineUsers));

    // socket.on("sent_request", (data: any) => {
    //   console.log(
    //     `Friend Request sent to id: ${data.id} and name: ${data.name}`
    //   );
    //   const targetSocketId = activeUsers.get(data?.id);
    //   io.to(targetSocketId!).emit("friend_request", {
    //     res: data.cUser,
    //     message: `${data.cUser.name} sent you a friend Request`,
    //   });
    // });

    // socket.on("offer", (data) => {
    //   const targetSocketId = activeUsers.get(data?.toUserId);
    //   // console.log(data?.toUserId);

    //   if (targetSocketId) {
    //     io.to(targetSocketId).emit("sendOffer", {
    //       userId: data?.toUserId,
    //       name: data?.toUserName,
    //       tuserId: data?.fromUserId,
    //       sdp: data?.sdp,
    //     });
    //     console.log(
    //       `Offer forwarded to User ID: ${data?.toUserId} (Socket ID: ${targetSocketId})`
    //     );
    //   } else {
    //     console.log(`User ID: ${data?.toUserId} is not online.`);
    //   }
    // });

    // socket.on("answer", (data) => {
    //   console.log("Answer to: ", data?.toUserId);

    //   const targetSocketId = activeUsers.get(data?.toUserId);
    //   if (targetSocketId) {
    //     io.to(targetSocketId).emit("sendAnswer", {
    //       userId: data?.toUserId,
    //       name: data?.toUserName,
    //       sdp: data?.sdp,
    //     });
    //     console.log(
    //       `Answer forwarded to User ID: ${data?.toUserId} (Socket ID: ${targetSocketId})`
    //     );
    //   } else {
    //     console.log(`User ID: ${data?.toUserId} is not online.`);
    //   }
    // });

    // socket.on("candidate", (data) => {
    //   const targetSocketId = activeUsers.get(data?.toUserId);
    //   if (targetSocketId) {
    //     io.to(targetSocketId).emit("sendCandidate", {
    //       candidate: data?.candidate,
    //     });
    //     // console.log(
    //     //   `Candidate forwarded to User ID: ${data?.toUserId} (Socket ID: ${targetSocketId})`
    //     // );
    //   } else {
    //     console.log(`User ID: ${data?.toUserId} is not online.`);
    //   }
    // });

    // socket.on("addUser", (data) => {
    //   socket.join(data?.room);
    //   console.log(`A user entered chat: ${data?.room}`);
    // });

    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId, createdAt }) => {
      const receiver = activeUsers.get(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", {
          senderId,
          receiverId,
          text,
          conversationId, 
          createdAt,
        });
        console.log(`Text:${text} from convId:${conversationId} to ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is not online.`);
      }
    });

    // socket.on("test", (data) => {
    //   socket.broadcast.emit("test2", data);
    // });

    socket.on("disconnect", () => {
      // let i = onlineUsers.indexOf(socket.id);
      // onlineUsers.splice(i, 1, 0);
      // console.log("User disconnected: ", socket.id);
      activeUsers.forEach((value, key) => {
        if (value.socketId === socket.id) {
          activeUsers.delete(key);
          console.log(`User with userId: ${key} logged out.`);
        }
      });
      for (const userId in onlineUsers) {
        if (onlineUsers[userId].socketId === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
  

      // removeUser(socket.id);
      io.emit("onlineUsers", Array.from(activeUsers.entries()).map(([userId, userInfo]) => ({
        _id: userId,
        socketId: userInfo.socketId
      })));
    });
  }
);

server.listen(8900, () => {
  console.log("Web Socket connecting running at Port: 8900");
});
