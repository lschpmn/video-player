import { REMOVE_SERVER_EVENT } from '../../constants';


export const removeServerEvent = (id: string) => ({
  payload: id,
  type: REMOVE_SERVER_EVENT,
});
