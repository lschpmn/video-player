export type ExplorerState = {
  pwd: string,
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