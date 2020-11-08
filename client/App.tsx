import makeStyles from '@material-ui/core/styles/makeStyles';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Controls from './components/Controls';
import Explorer from './components/Explorer';
import FileStructure from './components/FileStructure';
import FileUpload from './components/FileUpload';
import Media from './components/Media';
import TopBar from './components/TopBar';

const App = () => {
  const classes = useStyles({});
  return <FileUpload>
    <div className={classes.container}>
      <div className={classes.top} >
        <TopBar />
      </div>
      <div className={classes.middle}>
        <div style={{ flex: 1 }}>
          <Media />
        </div>

        <div style={{ flex: 3 }}>
          <Explorer />
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <FileStructure />
        </div>
      </div>

      <div className={classes.bottom}>
        <Controls />
      </div>
    </div>
  </FileUpload>;
};

const useStyles = makeStyles(theme => ({
  bottom: {
    alignSelf: 'flex-end',
    width: '100%',
  },
  container: {
    alignItems: 'stretch',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  middle: {
    display: 'flex',
    flexDirection: 'row',
    flex: 9,
    height: '100%',
    width: '100%',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    height: '3rem',
    width: '100%',
  },
}));

export default hot(App);
