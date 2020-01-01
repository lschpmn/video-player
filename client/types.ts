import { ChromecastInfo, MediaStatus } from '../types';

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
  drives: Directory,
  inspections: Inspections,
};

export interface Directory {
  [s: string]: boolean | Directory,
}

export type FileItem = {
  files?: FileItem[],
  size: number,
  type: 'dir' | 'file' | 'forbidden',
};

export type FileStructure = {
  [s: string]: FileItem,
};

export type Inspections = {
  [s: string]: {
    size: number,
    type: 'dir' | 'file' | 'forbidden',
  },
};

export type ReducerState = {
  chromecastStore: ChromecastStoreState,
  explorer: ExplorerState,
};

export type VolumeStatus = {
  level: number,
  muted: boolean,
};
