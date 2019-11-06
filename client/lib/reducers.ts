import { cloneDeep, set } from 'lodash';
import { combineReducers } from 'redux';
import { CONNECT, GET_CHROMECASTS, GET_DRIVES, GET_FILES, INSPECT_FILE, SET_CHROMECASTS } from '../../constants';
import { ChromecastStoreState, Directory, ExplorerState, PlayerState } from '../types';
import { PAUSED, UPDATE_STATUS } from './player-actions';

type Action = {
  type: string,
  payload: any,
};

const defaultStateExplorer = {
  currentLocation: [],
  drives: {},
  inspections: {},
};

const defaultChromecastStore = {
  chromecasts: [],
  loading: false,
  selected: null,
};

function chromecastStore(state: ChromecastStoreState = defaultChromecastStore, action: Action) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        selected: action.payload,
      };
    case GET_CHROMECASTS:
      return {
        ...state,
        loading: true,
      };
    case SET_CHROMECASTS:
      return {
        ...state,
        chromecasts: action.payload,
        loading: false,
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
    default:
      return state;
  }
}

const defaultStateStatus: PlayerState = {
  contentId: '',
  currentTime: 0,
  duration: 0,
  playerState: PAUSED,
  volume: { level: 1, muted: false },
  videoInfo: { width: 0, height: 0 },
};

function status(state: PlayerState = defaultStateStatus, action) {
  switch (action.type) {
    case UPDATE_STATUS:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

export default combineReducers({
  chromecastStore,
  explorer,
  status,
});
