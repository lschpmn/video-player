import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';

const TopBar = () => {
  const classes = useStyles({});
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  console.log(theme.palette)

  return <div className={classes.container}>
    <IconButton onClick={() => setOpen(true)}>
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
        <Input />
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
