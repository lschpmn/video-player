import { join } from 'path';
import { setFiles } from '../../client/lib/file-actions';
import { SET_CURRENT_LOCATION } from '../../constants';
import { getDrives, getFileItems } from './file-utils';

export default async (type: string, payload: any, dispatch: (action: any) => void) => {
  if (type === SET_CURRENT_LOCATION) {
    const files = !!payload.length
      ? await getFileItems(join(...payload))
      : await getDrives();

    dispatch(setFiles(files));
  }
};

