import Folder from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LoopIcon from '@material-ui/icons/Loop';
import * as React from 'react';
import { setCurrentLocation } from '../../lib/file-actions';
import { launch } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { FileItem } from '../../types';

type Props = {
  item: FileItem,
};

const ExplorerItem = ({ item }: Props) => {
  const currentLocation = item.path.split('/');
  const launchAction = useAction(() => launch(item.path));
  const setCurrentLocationAction = useAction(() =>
    setCurrentLocation(currentLocation), [currentLocation]);

  return <div style={styles.folder}>
    {!item.images && (item.type === 'dir'
      ? <Folder onDoubleClick={setCurrentLocationAction} style={styles.folderIcon}/>
      : <InsertDriveFileIcon style={styles.folderIcon}/>)
    }
    {item.images === 'loading' && <LoopIcon style={styles.folderIcon} />}
    {item.images && item.images !== 'loading' &&
      <img onDoubleClick={launchAction} style={styles.image} src={item.images[0]} alt="thumbnail"/>
    }
    <div style={styles.folderText}>{currentLocation.slice(-1)[0]}</div>
  </div>;
};

export default ExplorerItem;

const styles = {
  folder: {
    cursor: 'pointer',
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
  image: {
    maxWidth: '100%',
  },
};
