import {
  GET_DRIVES_SERVER,
  GET_FILE_ITEMS,
  GET_FILES_SERVER,
  INSPECT_FILE_SERVER,
  SET_CURRENT_LOCATION,
} from '../../constants';

export const getDrives = () => ({
  type: GET_DRIVES_SERVER,
});

export const getFiles = (location: string[]) => ({
  payload: location,
  type: GET_FILES_SERVER,
});

export const getFileItems = (location: string[]) => ({
  payload: location,
  type: GET_FILE_ITEMS,
});

export const inspectFile = (path: string) => ({
  payload: path,
  type: INSPECT_FILE_SERVER,
});

export const setCurrentLocation = (currentLocation: string[]) => ({
  payload: currentLocation,
  type: SET_CURRENT_LOCATION
});
