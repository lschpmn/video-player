'use strict';

import axios from 'axios';

export const CHANGE_MEDIA = 'CHANGE_MEDIA';
export const PLAY = 'PLAY';
  
export function changeMedia(dispatch) {
  return filePath => {
    dispatch({type: CHANGE_MEDIA, data: filePath});
    
    axios.post('http://localhost:3000/api/play', {filePath});
  }
}

export function changePlay(dispatch) {
  return isPlaying => {
    dispatch({type: PLAY, data: isPlaying});

    axios.post('http://localhost:3000/api/pause');
  }
}