import Folder from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { join } from 'path';
import * as React from 'react';
import { setCurrentLocation } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { FileItem } from '../../types';

type Props = {
  currentLocation: string[],
  drive: FileItem,
  name: string,
};

const ExplorerItem = ({ currentLocation, drive, name }: Props) => {
  const setCurrentLocationAction = useAction(setCurrentLocation);

  return <div key={join(...currentLocation, name)} style={styles.folder}>
    {drive.type === 'dir'
      ? <Folder onDoubleClick={() => setCurrentLocationAction([...currentLocation, name])} style={styles.folderIcon}/>
      : <InsertDriveFileIcon style={styles.folderIcon}/>
    }
    <div style={styles.folderText}>{name}</div>
  </div>;
};

export default ExplorerItem;

const styles = {
  folder: {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    margin: '1rem',
    width: '8rem',
  } as React.CSSProperties,
  folderIcon: {
    fontSize: '5rem',
    margin: '0 auto',
  } as React.CSSProperties,
  folderText: {
    textAlign: 'center',
    wordBreak: 'break-word',
  } as React.CSSProperties,
};
