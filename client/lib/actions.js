'use strict';

import axios from 'axios';

export const PLAY = 'PLAYING';
export const PAUSE = 'PAUSED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

const HOST = 'http://localhost:3000/api/';

export function play(dispatch) {
  return filePath => {
    axios.post(HOST + 'play', {filePath})
      .then(({data}) => {
        dispatch({
          type: UPDATE_STATUS,
          data,
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

export function getStatus(dispatch) {
  return () => {
    axios.get(HOST + 'status')
      .then(res => {
        console.log(res);
        dispatch({
          type: UPDATE_STATUS,
          data: res.data,
        });
      })
      .catch(console.log);
  };
}