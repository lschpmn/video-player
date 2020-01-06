import makeStyles from '@material-ui/core/styles/makeStyles';
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
  const classes = useStyles({});

  return <div className={classes.container}>
    {!item.images && (item.type === 'dir'
      ? <Folder onDoubleClick={setCurrentLocationAction}/>
      : <InsertDriveFileIcon/>)
    }
    {item.images === 'loading' && <LoopIcon />}
    {item.images && item.images !== 'loading' &&
      <img onDoubleClick={launchAction} src={item.images[0]} alt="thumbnail"/>
    }
    <div>{currentLocation.slice(-1)[0]}</div>
  </div>;
};

const useStyles = makeStyles(theme => ({
  container: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    padding: '1rem',
    width: '8rem',

    '& div': {
      textAlign: 'center',
      wordBreak: 'break-word',
    },

    '& img': {
      width: '8rem',
    },

    '& svg': {
      fontSize: '5rem',
      margin: '0 auto',
    },

    '&:hover': {
      backgroundColor: theme.palette.grey['300'],
    },
  },
}));

export default ExplorerItem;
