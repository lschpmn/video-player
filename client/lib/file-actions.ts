import axios from 'axios';
import { join } from 'path';

const HOST = 'http://localhost:3000/api/files';
export const GET_DRIVES = 'file/GET_DRIVES';
export const GET_FILES = 'file/GET_FILES';
export const INSPECT_FILE = 'INSPECT_FILE';

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

    const response = await axios.get(`${HOST}/list/${encodeURIComponent(path)}`);

    return dispatch({
      type: GET_FILES,
      payload: {
        location,
        files: response.data,
      },
    });
  };
}

export function inspectFile(path: string) {
  return async dispatch => {
    try {
      const response = await axios.get(`${HOST}/inspect/${encodeURIComponent(path)}`);

      return dispatch({
        type: INSPECT_FILE,
        payload: {
          path,
          inspection: response.data,
        },
      });
    } catch (err) {
      return dispatch({
        type: INSPECT_FILE,
        payload: {
          path,
          inspection: {
            type: 'forbidden',
          },
        },
      });
    }
  };
}