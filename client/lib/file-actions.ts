import axios from 'axios';
import { join } from 'path';

const HOST = 'http://localhost:3001/api/files';
export const GET_DRIVES = 'file/GET_DRIVES';
export const GET_FILES = 'file/GET_FILES';

export function getDrives() {
  return async dispatch => {
    const response = await axios.get(HOST + '/get-drives');

    return dispatch({
      type: GET_DRIVES,
      payload: response.data,
    });
  };
}

export function getFiles(location: string[]) {
  return async dispatch => {
    const path = join(...location) + '/';
    console.log('getFiles');
    console.log(path);

    const url = HOST + '/list/' + encodeURIComponent(path);
    const response = await axios.get(url);

    return dispatch({
      type: GET_FILES,
      payload: {
        location,
        files: response.data,
      },
    });
  };
}