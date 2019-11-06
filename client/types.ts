import { ChromecastInfo } from '../types';

export type ChromecastStoreState = {
  chromecasts: ChromecastInfo[],
  loading: boolean,
  selected?: ChromecastInfo,
};

export type ExplorerState = {
  currentLocation: string[],
  drives: Directory,
  inspections: Inspections,
};

export interface Directory {
  [s:string]: boolean | Directory,
}

export type Inspections = {
  [s:string]: {
    size: number,
    type: 'dir' | 'file' | 'forbidden',
  },
};

export interface Player {
  close: () => void,
  getStatus: (callback: (err: Error | null, status: any) => void) => void,
  load: (media: any, options: { autoplay: boolean }, callback: (err: Error, status: any) => void) => void;
}

export type PlayerState = {
  contentId: string,
  currentTime: number,
  duration: number,
  playerState: string,
  volume: {
    level: number,
    muted: boolean,
  },
  videoInfo: {
    width: number,
    height: number,
  },
};

export type ReducerState = {
  chromecastStore: ChromecastStoreState,
  explorer: ExplorerState,
  status: PlayerState,
};
