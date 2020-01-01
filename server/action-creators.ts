import {
  CONNECTION,
  GET_DRIVES,
  GET_FILES,
  INSPECT_FILE,
  LOG,
  SET_CHROMECASTS,
  SET_FILE_ITEMS,
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

export const log = message => ({
  payload: message,
  type: LOG,
});

export const setFileItemsAction = (files, location: string[]) => ({
  payload: {
    files,
    location,
  },
  type: SET_FILE_ITEMS
});

export const setMediaDisconnect = () => ({
  type: SET_MEDIA_DISCONNECT,
});

export const setMediaStatus = (status: MediaStatusServer): { payload: MediaStatus, type: typeof SET_MEDIA_STATUS } => ({
  payload: {
    contentId: status.media?.contentId,
    currentTime: status.currentTime,
    duration: status.media?.duration,
    subtitle: status.media?.metadata?.subtitle,
    playerState: status.playerState === 'PLAYING' || status.playerState === 'BUFFERING'
      ? 'PLAYING' : 'PAUSED',
    title: status.media?.metadata?.title,
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
