import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import AddIcon from '@material-ui/icons/Add';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { launch } from '../lib/player-actions';
import { useAction } from '../lib/utils';

const TopBar = () => {
  const classes = useStyles({});
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const launchAction = useAction(launch);

  const onEnter = useCallback(({ key }) => {
    if (key === 'Enter') {
      console.log('enter hit');
      launchAction(url, true);
      console.log('launch');
      setOpen(false);
      setUrl('');
    }
  }, [url]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', onEnter);
      return () => document.removeEventListener('keydown', onEnter);
    }
  }, [open, onEnter]);
  console.log(`open ${open}`);

  return <div className={classes.container}>
    <IconButton onClick={() => {
      console.log('setOpen true')
      setOpen(true);
    }}>
      <AddIcon style={{ color: 'white' }}/>
    </IconButton>
    <Modal open={open} onBackdropClick={() => setOpen(false)} style={{
      border: '1px solid black',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
    }}>
      <Paper elevation={3} style={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        margin: 'auto',
        outline: 'none',
        padding: '2rem',
      }}>
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
      </Paper>
    </Modal>
  </div>;
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    width: '100%',
  },
}));

export default hot(TopBar);
