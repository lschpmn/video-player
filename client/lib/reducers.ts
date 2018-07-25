'use strict';

import { combineReducers } from 'redux';
import { GET_DRIVES } from './file-actions';
import { PAUSE, UPDATE_STATUS } from './player-actions';
import { ExplorerState, PlayerState } from '../types';

type Action = {
  type: string,
  payload: any,
};

const defaultStateExplorer = {
  structure: {},
};

function explorer(state: ExplorerState = defaultStateExplorer, action: Action) {
  switch(action.type) {
    case GET_DRIVES:{
      const drives: string[] = action.payload;
      const driveObj = {};
      for (let drive of drives) {
        driveObj[drive.replace(':', '')] = true;
      }

      return {
        ...state,
        structure: driveObj,
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
  switch(action.type) {
    case UPDATE_STATUS:
      return {...state, ...action.data};
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