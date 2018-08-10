export interface Command {
  address: string,
}

export interface CommandStart extends Command{
  address: string,
  url: string,
}

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