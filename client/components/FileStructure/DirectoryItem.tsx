import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRight from '@material-ui/icons/ArrowRight';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getFileItems, setCurrentLocation } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { FileStructure } from '../../types';

type Props = {
  fileStructure: FileStructure,
  location: string[],
  setCurrentLocation: typeof setCurrentLocation,
};

const DirectoryItem = ({ fileStructure, location, setCurrentLocation }: Props) => {
  const getFileItemsAction = useAction(getFileItems);
  const [isOpen, setIsOpen] = useState(false);
  const setCurrentLocationAction = useCallback(() => setCurrentLocation(location), []);
  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const fileItem = useMemo(() => fileStructure[location.slice(-1)[0]], [fileStructure]);
  const classes = useStyles({});

  const setLocation = useCallback(() => {
    setCurrentLocationAction();
    getFileItemsAction(location);
  }, []);

  useEffect(() => {
    if (isOpen && fileItem.type === 'dir' && !fileItem.files) {
      getFileItemsAction(location);
    }
  }, [isOpen]);

  return <div className={classes.container}>
    <div className={classes.nameContainer}>
      {isOpen ? <ArrowDropDownIcon onMouseDown={toggleOpen}/> : <ArrowRight onMouseDown={toggleOpen}/>}
      <div className={classes.name} onMouseDown={setLocation}>
        {location.slice(-1)[0]}
      </div>
    </div>
    {isOpen && fileItem.files && Object.entries(fileItem.files)
      .filter(([name, item]) => item.type === 'dir')
      .map(([name, item]) =>
        <div className={classes.children} key={[...location, name].join('/')}>
          <DirectoryItem
            fileStructure={fileItem.files}
            location={[...location, name]}
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
      backgroundColor: theme.palette.grey['200'],
    },
  },
}));

export default DirectoryItem;
