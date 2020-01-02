import makeStyles from '@material-ui/core/styles/makeStyles';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Controls from './components/Controls';
import Explorer from './components/Explorer';
import FileStructure from './components/FileStructure';
import FileUpload from './components/FileUpload';
import Media from './components/Media';

const App = () => {
  const classes = useStyles({});
  return <FileUpload>
    <div className={classes.container}>
      <div className={classes.top} />
      <div style={styles.middle}>
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

      <div style={styles.bottom}>
        <Controls />
      </div>
    </div>
  </FileUpload>;
};

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'stretch',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  top: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'row',
    height: '3rem',
    width: '100%',
  },
}));

export default hot(App);

const styles = {
  bottom: {
    alignSelf: 'flex-end',
    width: '100%',
  } as React.CSSProperties,
  middle: {
    display: 'flex',
    flexDirection: 'row',
    flex: 9,
    height: '100%',
    width: '100%',
  } as React.CSSProperties,
  parent: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  } as React.CSSProperties,
};
