export type ExplorerState = {
  drives: Directory,
};

export interface Directory {
  [s:string]: boolean | Directory,
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