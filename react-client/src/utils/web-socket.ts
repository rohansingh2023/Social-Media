import io from "socket.io-client";

export const socket = io("ws://localhost:8900");

// export const signalSocket = io("ws://localhost:3010");
