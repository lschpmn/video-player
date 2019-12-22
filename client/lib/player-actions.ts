import {
  CONNECT,
  GET_CHROMECASTS,
  GET_MEDIA_STATUS,
  GET_STATUS,
  LAUNCH,
  LAUNCH_APP,
  PAUSE,
  PLAY,
  SEEK,
  SET_MUTED,
  SET_VOLUME,
  STOP_MEDIA,
} from '../../constants';
import { ChromecastInfo } from '../../types';

export const PLAYING = 'PLAYING';

export const connect = (chromecastInfo: ChromecastInfo) => ({
  payload: chromecastInfo,
  type: CONNECT,
});

export const getChromecasts = () => ({
  type: GET_CHROMECASTS,
});

export const getMediaStatus = () => ({
  type: GET_MEDIA_STATUS,
});

export const getStatus = () => ({
  type: GET_STATUS,
});

export const launch = (path: string, isUrl = false) => ({
  payload: {
    isUrl,
    path,
  },
  type: LAUNCH,
});

export const launchApp = (appId: string) => ({
  payload: appId,
  type: LAUNCH_APP,
});

export const play = () => ({
  type: PLAY,
});

export const pause = () => ({
  type: PAUSE,
});

export const seek = (time: number) => ({
  payload: time,
  type: SEEK,
});

export const setMuted = (muted: boolean) => ({
  payload: muted,
  type: SET_MUTED,
});

export const setVolume = (volume: number) => ({
  payload: volume,
  type: SET_VOLUME,
});

export const stopMedia = () => ({
  type: STOP_MEDIA,
});
