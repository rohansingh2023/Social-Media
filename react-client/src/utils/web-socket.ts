import io from "socket.io-client";

export const socket = io("ws://localhost:8900");

// export const signalSocket = io("ws://localhost:3010");

// On Layout.tsx in react root compinent, I want check if socket server (socket-io in express) is not connected I want to show this custom dialog with a error message