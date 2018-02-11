'use strict';

import axios from 'axios';

export const PLAY = 'PLAYING';
export const PAUSE = 'PAUSED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

const HOST = 'http://localhost:3000/api/';

export function changeVolume(dispatch) {
  return volume => {
    axios.post(HOST + 'volume', { volume })
      .then(({data}) => update(data, dispatch))
      .catch(err => {
        console.log(err);
        dispatch({
          type: UPDATE_STATUS,
          data: {playerState: PAUSE},
        });
      });
  };
}

export function getStatus(dispatch) {
  return () => {
    axios.get(HOST + 'status')
      .then(({data}) => update(data, dispatch))
      .catch(err => {
        console.log(err);
        dispatch({
          type: UPDATE_STATUS,
          data: {playerState: PAUSE},
        });
      });
  };
}

export function play(dispatch) {
  return filePath => {
    axios.post(HOST + 'play', {filePath})
      .then(({data}) => update(data, dispatch))
      .catch(console.log);
  };
}

export function pause(dispatch) {
  return () => {
    axios.post(HOST + 'pause')
      .then(({data}) => update(data, dispatch))
      .catch(console.log);
  };
}

export function resume(dispatch) {
  return () => {
    axios.post(HOST + 'resume')
      .then(({data}) => update(data, dispatch))
      .catch(console.log);
  };
}

export function seek(dispatch) {
  return seconds => {
    axios.post(HOST + 'seek', {seconds})
      .then(({data}) => update(data, dispatch))
      .catch(console.log);
  };
}

function update(data, dispatch) {
  dispatch({
    type: UPDATE_STATUS,
    data,
  });
}