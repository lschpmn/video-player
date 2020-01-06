import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRight from '@material-ui/icons/ArrowRight';
import React, { useCallback, useEffect, useState } from 'react';
import { setCurrentLocation } from '../../lib/file-actions';
import { requestFileItems } from '../../lib/utils';
import { FileItem } from '../../types';

type Props = {
  fileItem: FileItem,
  setCurrentLocation: typeof setCurrentLocation,
};

const DirectoryItem = ({ fileItem, setCurrentLocation }: Props) => {
  const [files, setFiles] = useState([] as FileItem[]);
  const [isOpen, setIsOpen] = useState(false);
  const location = fileItem.path.split('/');
  const setCurrentLocationAction = useCallback(() => setCurrentLocation(location), []);
  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const classes = useStyles({});

  useEffect(() => {
    if (isOpen && fileItem.type === 'dir' && !files.length) {
      requestFileItems(fileItem.path + '/')
        .then(res => {
          setFiles(res);
        })
        .catch(console.log);
    }
  }, [isOpen]);

  return <div className={classes.container}>
    <div className={classes.nameContainer}>
      {isOpen ? <ArrowDropDownIcon onMouseDown={toggleOpen}/> : <ArrowRight onMouseDown={toggleOpen}/>}
      <div className={classes.name} onMouseDown={setCurrentLocationAction}>
        {location.slice(-1)[0]}
      </div>
    </div>
    {isOpen && files
      .filter(item => item.type === 'dir')
      .map(item =>
        <div className={classes.children} key={item.path}>
          <DirectoryItem
            fileItem={item}
            setCurrentLocation={setCurrentLocation}
          />
        </div>
      )
    }
  </div>
};

const useStyles = makeStyles(theme => ({
  children: {
    paddingLeft: 6,
  },
  container: {
    wordBreak: 'break-word',
  },
  name: {
    flex: 1,
    padding: 6,
  },
  nameContainer: {
    alignItems: 'center',
    display: 'flex',

    '&:hover': {
      backgroundColor: theme.palette.grey['300'],
    },
  },
}));

export default DirectoryItem;
