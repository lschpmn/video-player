import { ChromecastInfo, MediaStatus, ServerEvent } from '../types';

export type ChromecastStoreState = {
  chromecasts: ChromecastInfo[],
  isConnected: boolean,
  loading: boolean,
  mediaStatus?: MediaStatus,
  selected?: ChromecastInfo,
  volumeStatus?: VolumeStatus,
};

export type FileItem = {
  images?: 'failed' | 'loading' | string[],
  path: string,
  size?: number,
  type: 'dir' | 'file' | 'forbidden' | 'symlink',
};

export type ExplorerState = {
  currentLocation: string[],
};

export type ReducerState = {
  chromecastStore: ChromecastStoreState,
  explorer: ExplorerState,
  serverEvents: ServerEvent[],
};

export type VolumeStatus = {
  level: number,
  muted: boolean,
};

export type WindowState = {
  __PORT__: number,
};
