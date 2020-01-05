import Folder from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LoopIcon from '@material-ui/icons/Loop';
import * as React from 'react';
import { setCurrentLocation } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { FileItem } from '../../types';

type Props = {
  currentLocation: string[],
  item: FileItem,
  name: string,
};

const ExplorerItem = ({ currentLocation, item, name }: Props) => {
  const setCurrentLocationAction = useAction(setCurrentLocation);

  return <div style={styles.folder}>
    {!item.images && (item.type === 'dir'
      ? <Folder onDoubleClick={() => setCurrentLocationAction([...currentLocation, name])} style={styles.folderIcon}/>
      : <InsertDriveFileIcon style={styles.folderIcon}/>)
    }
    {item.images === 'loading' && <LoopIcon style={styles.folderIcon} />}
    {item.images && item.images !== 'loading' &&
      <img style={{ maxWidth: '100%' }} src={item.images}  alt="thumbnail"/>
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
