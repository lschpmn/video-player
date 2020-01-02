import { combineReducers } from 'redux';
import {
  CONNECT,
  CONNECTION,
  GET_CHROMECASTS,
  GET_MEDIA_STATUS,
  PAUSE,
  PLAY,
  SEEK,
  SET_CHROMECASTS,
  SET_CURRENT_LOCATION,
  SET_MEDIA_DISCONNECT,
  SET_MEDIA_STATUS,
  SET_STATUS,
} from '../../constants';
import { ChromecastInfo, ReceiverStatus } from '../../types';
import { ChromecastStoreState, ExplorerState, VolumeStatus } from '../types';

type Action = {
  type: string,
  payload: any,
};

const defaultChromecastStore: ChromecastStoreState = {
  chromecasts: [],
  isConnected: false,
  loading: false,
  mediaStatus: null,
  selected: null,
  volumeStatus: null,
};

const defaultExplorerState: ExplorerState = {
  currentLocation: [],
};

function chromecastStore(state: ChromecastStoreState = defaultChromecastStore, action: Action) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        loading: true,
        selected: action.payload,
      };
    case CONNECTION:
      return {
        ...state,
        loading: false,
        isConnected: action.payload,
      };
    case SET_CHROMECASTS:
      return {
        ...state,
        chromecasts: action.payload,
        loading: false,
      };
    case SET_MEDIA_DISCONNECT:
      return {
        ...state,
        loading: false,
        mediaStatus: null,
      };
    case SET_MEDIA_STATUS:
      return {
        ...state,
        loading: false,
        mediaStatus: {
          ...state.mediaStatus,
          ...action.payload,
        },
      };
    case SET_STATUS:
      return {
        ...state,
        selected: setSelected(state, action.payload),
        volumeStatus: setVolume(state, action.payload),
      };
    case GET_CHROMECASTS:
    case GET_MEDIA_STATUS:
    case PAUSE:
    case PLAY:
    case SEEK:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}

function explorer(state: ExplorerState = defaultExplorerState, action) {
  switch (action.type) {
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  chromecastStore,
  explorer,
});

function setSelected(state: ChromecastStoreState, status: ReceiverStatus): ChromecastInfo {
  const appId = status?.status?.applications?.[0]?.appId;

  return appId
    ? {
      ...state.selected,
      appId,
    }
    : state.selected;
}

function setVolume(state: ChromecastStoreState, status: ReceiverStatus): VolumeStatus {
  const volume = status?.status?.volume;

  return volume
    ? {
      level: volume.level,
      muted: volume.muted,
    }
    : state.volumeStatus;
}
