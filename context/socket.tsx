"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import { NODE_ENV, DEV_BASE_URL, PROD_BASE_URL } from "@/config";

type PropsType = {
  children: React.ReactNode;
};

type SocketType = {
  socket?: Socket;
};
const SocketContext = createContext({} as SocketType);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider: React.FC<PropsType> = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const url = NODE_ENV === "development" ? DEV_BASE_URL : PROD_BASE_URL;
    const connection = io(url!);

    setSocket(connection);

    return () => {
      connection.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
