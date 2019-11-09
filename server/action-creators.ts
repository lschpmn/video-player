import {
  CONNECTION,
  GET_DRIVES,
  GET_FILES,
  INSPECT_FILE,
  SET_CHROMECASTS,
  SET_MEDIA_DISCONNECT,
  SET_MEDIA_STATUS,
  SET_STATUS,
} from '../constants';
import { MediaStatus, MediaStatusServer } from '../types';

export const connection = (isConnected: boolean) => ({
  payload: isConnected,
  type: CONNECTION,
});

export const getDrivesAction = drives => ({
  payload: drives,
  type: GET_DRIVES,
});

export const getFilesAction = (files, location: string[]) => ({
  payload: {
    files,
    location,
  },
  type: GET_FILES,
});

export const setMediaDisconnect = () => ({
  type: SET_MEDIA_DISCONNECT,
});

export const setMediaStatus = (status: MediaStatusServer): { payload: MediaStatus, type: typeof SET_MEDIA_STATUS } => ({
  payload: {
    contentId: status.media?.contentId,
    currentTime: status.currentTime,
    duration: status.media?.duration,
    playerState: status.playerState,
    volume: status.volume,
  },
  type: SET_MEDIA_STATUS,
});

export const setStatus = status => ({
  payload: status,
  type: SET_STATUS,
});

export const inspectFileAction = (inspection, path) => ({
  payload: {
    inspection,
    path,
  },
  type: INSPECT_FILE,
});

export const setChromecasts = chromecasts => ({
  payload: chromecasts,
  type: SET_CHROMECASTS,
});
