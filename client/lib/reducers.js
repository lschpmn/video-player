'use strict';

import { combineReducers } from 'redux';
import { CHANGE_MEDIA, PLAY } from './actions';

function media(state={}, action) {
  switch(action.type) {
    case CHANGE_MEDIA:
      return {
        path: action.data, 
        timestamp: Date.now(),
      };
    default:
      return state;
  }
}

function play(state=false, action) {
  switch(action.type) {
    case PLAY:
      return action.data;
    default:
        return state;
  }
}

export default combineReducers({
  media,
  play,
});