import { SET_CURRENT_LOCATION } from '../../constants';

export const setCurrentLocation = (currentLocation: string[]) => ({
  payload: currentLocation,
  type: SET_CURRENT_LOCATION
});
