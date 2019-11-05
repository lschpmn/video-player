import { cloneDeep, set } from 'lodash';
import { combineReducers } from 'redux';
import { Directory, ExplorerState, PlayerState } from '../types';
import { GET_DRIVES, GET_FILES, INSPECT_FILE } from '../../constants';
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

      const newDrives = set(cloneDeep(state.drives), location, directory);

      return {
        ...state,
        currentLocation: location,
        drives: newDrives,
      };
    }
    case INSPECT_FILE: {
      const { inspection, path } = action.payload;

      return {
        ...state,
        inspections: {
          ...state.inspections,
          [path]: inspection
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
  videoInfo: { width: 0, height: 0, },
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
  explorer,
  status,
});
