import { cloneDeep, set } from 'lodash';
import { combineReducers } from 'redux';
import { GET_DRIVES, GET_FILES } from './file-actions';
import { PAUSE, UPDATE_STATUS } from './player-actions';
import { ExplorerState, FileEntry, PlayerState } from '../types';

type Action = {
  type: string,
  payload: any,
};

const defaultStateExplorer = {
  structure: {},
};

function explorer(state: ExplorerState = defaultStateExplorer, action: Action) {
  switch (action.type) {
    case GET_DRIVES: {
      const drives: string[] = action.payload;
      const driveObj = {};
      for (let drive of drives) driveObj[drive] = true;

      return {
        ...state,
        structure: driveObj,
      };
    }
    case GET_FILES: {
      const { parents, path, files } = action.payload;
      const fileEntry: FileEntry = {};

      for (let file of files) {
        fileEntry[file] = true;
      }

      const newStructure = set(cloneDeep(state.structure), parents, fileEntry);

      return {
        ...state,
        structure: newStructure,
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
  playerState: PAUSE,
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

/**
 * @typedef {Object} Status
 * @property {String} contentId
 * @property {Number} currentTime
 * @property {Number} duration
 * @property {String} playerState
 * @property {{level: Number, muted: Boolean}} volume
 * @property {{width:Number, height: Number}} videoInfo
 */