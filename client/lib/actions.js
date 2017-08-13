'use strict';

export const CHANGE_MEDIA = 'CHANGE_MEDIA';
export const PLAY = 'PLAY';
  
export function changeMedia(dispatch) {
  return filePath => dispatch({type: CHANGE_MEDIA, data: filePath});
}

export function changePlay(dispatch) {
  return isPlaying => dispatch({type: PLAY, data: isPlaying});
}