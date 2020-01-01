import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getFileItems } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { FileStructure } from '../../types';

type Props = {
  fileStructure: FileStructure,
  location: string[],
};

const DirectoryItem = ({ fileStructure, location }: Props) => {
  const getFileItemsAction = useAction(getFileItems);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const fileItem = useMemo(() => fileStructure[location.slice(-1)[0]], [fileStructure]);
  const classes = useStyles({});

  useEffect(() => {
    if (isOpen && fileItem.type === 'dir' && !fileItem.files) {
      getFileItemsAction(location);
    }
  }, [isOpen]);

  return <div className={classes.container}>
    <div className={classes.name} onMouseDown={toggleOpen}>
      {location.slice(-1)[0]}
    </div>
    {isOpen && fileItem.files && Object.entries(fileItem.files)
      .filter(([name, item]) => item.type === 'dir')
      .map(([name, item]) =>
        <div className={classes.children} key={[...location, name].join('/')}>
          <DirectoryItem
            fileStructure={fileItem.files}
            location={[...location, name]}
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
    borderLeft: '1px solid',
    borderColor: theme.palette.grey['400'],
    padding: 6,

    '&:hover': {
      backgroundColor: theme.palette.grey['200'],
    },
  },
}));

export default DirectoryItem;
