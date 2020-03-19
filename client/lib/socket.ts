import { Socket } from 'socket.io';
import * as io from 'socket.io-client';

let socket;

export const getDrives = () => {
  const socket = getSocket();

  return new Promise((res, rej) => {
    socket.emit('get-drives', drives => {
      res(drives);
    });
  });
};

export const getSocket = (): Socket => {
  if (socket) return socket;
  return socket = io(`http://localhost:${window.__PORT__}`);
};
