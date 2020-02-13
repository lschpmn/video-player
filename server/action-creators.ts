import {
  CONNECTION,
  DB_UPDATE,
  LOG,
  SET_CHROMECASTS,
  SET_MEDIA_DISCONNECT,
  SET_MEDIA_STATUS,
  SET_STATUS,
} from '../constants';
import { DbSchema, MediaStatus, MediaStatusServer } from '../types';

export const connection = (isConnected: boolean) => ({
  payload: isConnected,
  type: CONNECTION,
});

export const dbUpdate = (db: DbSchema) => ({
  payload: db,
  type: DB_UPDATE,
});

export const log = message => ({
  payload: message,
  type: LOG,
});

export const setChromecasts = chromecasts => ({
  payload: chromecasts,
  type: SET_CHROMECASTS,
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
