import { Socket } from 'socket.io';
import * as io from 'socket.io-client';
import { GET_DRIVES, GET_FILES } from '../../constants';
import { FileItem } from '../../types';

let socket;

export const getDrives = (): Promise<FileItem[]> => {
  const socket = getSocket();

  return new Promise((res, rej) => {
    const rejectId = setTimeout(rej, 3000);

    socket.send(GET_DRIVES, null, drives => {
      res(drives);
      clearTimeout(rejectId);
    });
  });
};

export const getFiles = (path: string): Promise<FileItem[]> => {
  const socket = getSocket();

  return new Promise((res, rej) => {
    const rejectId = setTimeout(rej, 3000);

    socket.send(GET_FILES, path, files => {
      res(files);
      clearTimeout(rejectId);
    });
  });
};

export const getSocket = (): Socket => {
  if (socket) return socket;
  return socket = io(`http://localhost:${window.__PORT__}`);
};
