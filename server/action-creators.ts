import { GET_DRIVES, GET_FILES, INSPECT_FILE, SET_CHROMECASTS, SET_STATUS } from '../constants';

export const getDrivesAction = drives => ({
  payload: drives,
  type: GET_DRIVES,
});

export const getFilesAction = (files, location: string[]) => ({
  payload: {
    files,
    location,
  },
  type: GET_FILES,
});

export const setStatus = status => ({
  payload: status,
  type: SET_STATUS,
});

export const inspectFileAction = (inspection, path) => ({
  payload: {
    inspection,
    path,
  },
  type: INSPECT_FILE,
});

export const setChromecasts = chromecasts => ({
  payload: chromecasts,
  type: SET_CHROMECASTS,
});
