import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { launch } from '../lib/player-actions';
import { useAction } from '../lib/utils';

const TopBar = () => {
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const launchAction = useAction(launch);

  const onEnter = useCallback(() => {
    if (url === '') return;
    launchAction(url, true);
    setOpen(false);
    setUrl('');
  }, [url]);

  useEffect(() => {
    if (open) {
      const listener = ({ key }) => key === 'Enter' && onEnter();

      document.addEventListener('keydown', listener);
      return () => document.removeEventListener('keydown', listener);
    }
  }, [open, onEnter]);

  return <div className={classes.container}>
    <IconButton onMouseDown={() => setOpen(true)}>
      <AddIcon style={{ color: 'white' }}/>
    </IconButton>
    <Dialog
      open={open}
      onBackdropClick={() => setOpen(false)}
    >
      <DialogTitle>Add URL</DialogTitle>
      <DialogContent>
        <Input
          onChange={e => setUrl(e.target.value)}
          value={url}
        />
        <div style={{ height: '1rem' }} />
        <Button
          color='secondary'
          fullWidth
          onClick={onEnter}
          style={{ color: 'white' }}
          variant='contained'
        >
          Add URL
        </Button>
      </DialogContent>
    </Dialog>
  </div>;
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    width: '100%',
  },
}));

export default hot(TopBar);
