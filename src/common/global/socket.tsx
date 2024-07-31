import { io, Socket } from "socket.io-client";

export const connectSocket = (token: string | null) => {
  const socket: Socket = io(`https://socket.rarafoods.com.au?token=${token}`);
  socket.connect();
  return socket;
};
