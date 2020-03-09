import { ChromecastInfo, FileItem, MediaStatus, ServerEvent } from '../types';

export type ChromecastStoreState = {
  chromecasts: ChromecastInfo[],
  isConnected: boolean,
  loading: boolean,
  mediaStatus?: MediaStatus,
  selected?: ChromecastInfo,
  volumeStatus?: VolumeStatus,
};

export type ExplorerState = {
  currentLocation: string[],
  files: FileItem[],
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
