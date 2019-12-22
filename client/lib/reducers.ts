import { cloneDeep, set } from 'lodash';
import { combineReducers } from 'redux';
import {
  CONNECT,
  CONNECTION,
  GET_CHROMECASTS,
  GET_DRIVES,
  GET_FILES,
  GET_MEDIA_STATUS,
  INSPECT_FILE,
  PAUSE,
  PLAY,
  SEEK,
  SET_CHROMECASTS,
  SET_CURRENT_LOCATION,
  SET_MEDIA_DISCONNECT,
  SET_MEDIA_STATUS,
  SET_STATUS,
} from '../../constants';
import { ReceiverStatus } from '../../types';
import { ChromecastStoreState, Directory, ExplorerState } from '../types';

type Action = {
  type: string,
  payload: any,
};

const defaultStateExplorer = {
  currentLocation: [],
  drives: {},
  inspections: {},
};

const defaultChromecastStore: ChromecastStoreState = {
  chromecasts: [],
  isConnected: false,
  loading: false,
  mediaStatus: null,
  selected: null,
  volumeStatus: null,
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
      return Object.assign(
        {},
        setSelected(state, action.payload),
        setVolume(state, action.payload),
      );
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

function explorer(state: ExplorerState = defaultStateExplorer, action: Action) {
  switch (action.type) {
    case GET_DRIVES: {
      const drives: string[] = action.payload;
      const driveObj = {};
      for (let drive of drives) driveObj[drive] = true;

      return {
        ...state,
        drives: driveObj,
      };
    }
    case GET_FILES: {
      const { location, files } = action.payload;
      const directory: Directory = {};

      files.forEach(file => directory[file] = true);

      const drives = set(cloneDeep(state.drives), location, directory);

      return {
        ...state,
        currentLocation: location,
        drives,
      };
    }
    case INSPECT_FILE: {
      const { inspection, path } = action.payload;

      return {
        ...state,
        inspections: {
          ...state.inspections,
          [path]: inspection,
        },
      };
    }
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

function setSelected(state: ChromecastStoreState, status: ReceiverStatus): ChromecastStoreState {
  const appId = status?.status?.applications?.[0]?.appId;

  return appId
    ? {
      ...state,
      selected: {
        ...state.selected,
        appId,
      },
    }
    : state;
}

function setVolume(state: ChromecastStoreState, status: ReceiverStatus): ChromecastStoreState {
  const volume = status?.status?.volume;

  return volume
    ? {
      ...state,
      volumeStatus: {
        level: volume.level,
        muted: volume.muted,
      },
    }
    : state;
}
