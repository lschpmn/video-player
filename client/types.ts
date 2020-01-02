import { ChromecastInfo, MediaStatus } from '../types';

export type ChromecastStoreState = {
  chromecasts: ChromecastInfo[],
  isConnected: boolean,
  loading: boolean,
  mediaStatus?: MediaStatus,
  selected?: ChromecastInfo,
  volumeStatus?: VolumeStatus,
};

export type FileItem = {
  files?: FileStructure,
  size: number,
  type: 'dir' | 'file' | 'forbidden',
};

export type FileStructure = {
  [s: string]: FileItem,
};

export type FileStructureState = {
  currentLocation: string[],
  fileStructure: FileStructure,
};

export type ReducerState = {
  chromecastStore: ChromecastStoreState,
  fileStructureState: FileStructureState,
};

export type VolumeStatus = {
  level: number,
  muted: boolean,
};
