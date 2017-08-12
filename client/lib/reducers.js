'use strict';

import { combineReducers } from 'redux';

export const actions = {
  CHANGE_MEDIA: 'CHANGE_MEDIA',
  PLAY: 'PLAY',
};

function media(state={}, action) {
  switch(action.type) {
    case actions.CHANGE_MEDIA:
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
    case 'PLAY':
      return action.data;
    default:
        return state;
  }
}

export default combineReducers({
  media,
  play,
});