import EventEmitter = NodeJS.EventEmitter;
import { PLAYING } from './client/lib/player-actions';

export type Channel = EventEmitter & {
  send: (data: any) => void,
  close: () => void,
};

export type ChromecastInfo = {
  appId?: string,
  host: string,
  name: string,
};

export type DbSchema = {
  history: {
    [title: string]: number,
  },
  imageCache: {
    [key: string]: string,
  },
};

export type FileItem = {
  images?: 'failed' | 'loading' | string[],
  path: string,
  size?: number,
  type: 'dir' | 'file' | 'forbidden' | 'symlink',
};

export type Listener = (action: { type: string, payload?: any }) => void;

export type MediaStatus = {
  contentId: string,
  currentTime: number,
  duration: number,
  playerState: string,
  subtitle?: string,
  title: string,
  volume: {
    level: number,
    muted: boolean,
  },
  videoInfo?: {
    width: number,
    height: number,
  },
};

export type MediaStatusServer = {
  activeTrackIds: [],
  currentTime: number,
  currentItemId: number,
  items?: {
    autoplay: true,
    itemId: number,
    media: {
      contentId: string,
      contentType: string,
      duration: number,
      metadata: {
        type: number,
        metadataType: number,
        title: string,
        images: []
      },
      streamType: string,
    },
    orderId: number,
  }[],
  media?: {
    contentId: string,
    contentType: string,
    streamType: string,
    metadata: {
      type: number,
      metadataType: number,
      subtitle?: string,
      tertiaryTitle?: string,
      title: string,
      images: [],
    },
    mediaCategory: string,
    duration: number,
    tracks: {
      trackId: number,
      type: string,
    }[],
    breakClips: [],
    breaks: [],
  },
  mediaSessionId: number,
  playbackRate: number,
  playerState: typeof PLAYING | 'PAUSED' | 'BUFFERING' | 'IDLE',
  repeatMode: 'REPEAT_OFF' | 'REPEAT_ALL' | 'REPEAT_SINGLE' | 'REPEAT_ALL_AND_SHUFFLE',
  supportedMediaCommands: number,
  volume: {
    level: number,
    muted: boolean,
  },
};

export type ReceiverStatus = {
  requestId: number,
  status: {
    applications?: {
      appId: string,
      displayName: string,
      namespaces: { name: string }[],
      sessionId: string,
      statusText: string,
      transportId: string,
    }[],
    isActiveInput: boolean,
    volume: {
      level: number,
      muted: boolean,
    }
  },
  type: 'RECEIVER_STATUS'
};

export type ServerEvent = {
  id?: string,
  payload?: any,
  type: string,
};
