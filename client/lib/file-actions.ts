import { GET_DRIVES_SERVER, GET_FILE_ITEMS, SET_CURRENT_LOCATION } from '../../constants';

export const getDrives = () => ({
  type: GET_DRIVES_SERVER,
});

export const getFileItems = (location: string[]) => ({
  payload: location,
  type: GET_FILE_ITEMS,
});

export const setCurrentLocation = (currentLocation: string[]) => ({
  payload: currentLocation,
  type: SET_CURRENT_LOCATION
});
