import { SET_CURRENT_LOCATION, THUMBNAIL_REQUEST } from '../../constants';

export const setCurrentLocation = (currentLocation: string[]) => ({
  payload: currentLocation,
  type: SET_CURRENT_LOCATION
});

export const thumbnailRequest = () => ({
  payload: null,
  type: THUMBNAIL_REQUEST,
});
