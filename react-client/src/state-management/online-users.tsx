import React, { useState, createContext, ReactNode, useEffect } from "react";
import { socket } from "../utils/web-socket";

interface OnlineUsersContextType {
  onlineUsers: any;
  setOnlineUsers: React.Dispatch<React.SetStateAction<any>>;
}

export const OnlineUsersContext = createContext<OnlineUsersContextType | null>(
  null
);

interface OnlineUsersContextProviderProps {
  children: ReactNode; // ReactNode allows for any valid JSX children
}

export const OnlineUsersContextProvider: React.FC<
  OnlineUsersContextProviderProps
> = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("my-id");
    if (userId) {
      socket.emit("login", {
        userId,
      });
    }

    // This listener should only be set once
    const handleOnlineUsers = (data: any) => {
      setOnlineUsers(data);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    // Cleanup the listener on unmount
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};
