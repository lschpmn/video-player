'use strict';

import { combineReducers } from 'redux';
import { PAUSE, UPDATE_STATUS } from './actions';

const defaultState = {
  contentId: '',
  currentTime: 0,
  duration: 0,
  playerState: PAUSE,
  volume: { level: 1, muted: false },
  videoInfo: { width: 0, height: 0, },
};

function status(state=defaultState, action) {
  switch(action.type) {
    case UPDATE_STATUS:
      return {...state, ...action.data};
    default:
      return state;
  }
}

export default combineReducers({
  status,
});