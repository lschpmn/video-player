import { CHANGE_VOLUME, CONNECT, GET_CHROMECASTS, GET_STATUS, LAUNCH, PAUSE, PLAY, SEEK } from '../../constants';

export const PLAYING = 'PLAYING';
export const PAUSED = 'PAUSED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

export const changeVolume = (volume: number) => ({
  payload: volume,
  type: CHANGE_VOLUME,
});

export const connect = (host: string) => ({
  payload: host,
  type: CONNECT,
});

export const getChromecasts = () => ({
  type: GET_CHROMECASTS,
});

export const getStatus = () => ({
  type: GET_STATUS,
});

export const launch = (path: string) => ({
  payload: path,
  type: LAUNCH,
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
