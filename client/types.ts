export type ExplorerState = {
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