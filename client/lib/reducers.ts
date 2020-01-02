import cloneDeep from 'lodash/cloneDeep';
import { combineReducers } from 'redux';
import {
  CONNECT,
  CONNECTION,
  GET_CHROMECASTS,
  GET_DRIVES,
  GET_MEDIA_STATUS,
  PAUSE,
  PLAY,
  SEEK,
  SET_CHROMECASTS,
  SET_CURRENT_LOCATION,
  SET_FILE_ITEMS,
  SET_MEDIA_DISCONNECT,
  SET_MEDIA_STATUS,
  SET_STATUS,
} from '../../constants';
import { ChromecastInfo, ReceiverStatus } from '../../types';
import { ChromecastStoreState, FileStructureState, VolumeStatus } from '../types';
import { getFileItem } from './utils';

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

const defaultFileStructureState: FileStructureState = {
  currentLocation: [],
  fileStructure: {},
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

function fileStructureState(state: FileStructureState = defaultFileStructureState, action) {
  switch (action.type) {
    case GET_DRIVES: {
      const fileStructure = {};
      action.payload.forEach(drive => {
        fileStructure[drive] = {
          type: 'dir',
        };
      });

      return {
        ...state,
        fileStructure,
      };
    }
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload,
      };
    case SET_FILE_ITEMS: {
      const fileStructure = cloneDeep(state.fileStructure);
      const fileItem = getFileItem(fileStructure, action.payload.location);
      fileItem.files = action.payload.files;

      return {
        ...state,
        fileStructure,
      };
    }
    default:
      return state;
  }
}

export default combineReducers({
  chromecastStore,
  fileStructureState,
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
