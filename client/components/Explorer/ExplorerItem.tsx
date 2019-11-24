import Folder from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { join } from 'path';
import * as React from 'react';
import { useEffect } from 'react';
import { getFiles, inspectFile } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';

type Props = {
  currentLocation: string[],
  drive: {
    name: string,
    size?: number,
    type?: 'dir' | 'file' | 'forbidden',
  },
};

const ExplorerItem = ({ currentLocation, drive }: Props) => {
  const getFilesAction = useAction(getFiles);
  const inspectFileAction = useAction(inspectFile);

  useEffect(() => {
    if (!drive.type) inspectFileAction(join(...currentLocation, drive.name));
  }, []);

  return <div key={join(...currentLocation, drive.name)} style={styles.folder}>
    {drive.type === 'file'
      ? <InsertDriveFileIcon style={styles.folderIcon}/>
      : <Folder onDoubleClick={() => getFilesAction([...currentLocation, drive.name])} style={styles.folderIcon}/>}
    <div style={styles.folderText}>{drive.name}</div>
  </div>;
};

export default ExplorerItem;

const styles = {
  folder: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
    width: '8rem',
  } as React.CSSProperties,
  folderIcon: {
    fontSize: '5rem',
    margin: '0 auto',
  } as React.CSSProperties,
  folderText: {
    textAlign: 'center',
    wordBreak: 'break-all',
  } as React.CSSProperties,
};
