export type ExplorerState = {
  structure: FileEntry,
};

export interface FileEntry {
  [s:string]: boolean | FileEntry,
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