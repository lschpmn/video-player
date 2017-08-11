'use strict';

import { combineReducers } from 'redux';



function media(state, action) {
  switch(action.type) {
    
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