'use strict';

import axios from 'axios';

export const PLAY = 'PLAYING';
export const PAUSE = 'PAUSED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

const HOST = 'http://localhost:3000/api/';

export function play(dispatch) {
  return filePath => {
    axios.post(HOST + 'play', {filePath})
      .then(res => {
        const { currentTime, volume, videoInfo } = res.data;
        const { contentId, duration} = res.data.media;
        const status = {
          contentId,
          currentTime,
          duration,
          playerState: PLAY,
          volume, videoInfo
        };

        dispatch({
          type: UPDATE_STATUS,
          data: status,
        });
      })
      .catch(console.log);
  };
}

export function pause(dispatch) {
  return () => {
    axios.post(HOST + 'pause')
      .then(res => {
        dispatch({
          type: UPDATE_STATUS,
          data: { playerState: res.data.playerState },
        })
      })
      .catch(console.log);
  };
}

export function resume(dispatch) {
  return () => {
    axios.post(HOST + 'resume')
      .then(res => {
        dispatch({
          type: UPDATE_STATUS,
          data: { playerState: PLAY },
        })
      })
      .catch(console.log);
  };
}