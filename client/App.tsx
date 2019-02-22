import * as React from 'react';
import { connect } from 'react-redux';
import Controls from './components/Controls';
import FileStructure from './components/FileStructure';
import FileUpload from './components/FileUpload';
import { getStatus, pause, PAUSE, PLAY, resume, start } from './lib/player-actions';

type Props = {
  getStatus: () => void,
  pause: () => void,
  resume: () => void,
  start: (path: string) => void,
  status: any,
};

class App extends React.Component<Props> {
  statusTimeoutId?: number;

  async componentDidMount() {
    setTimeout(() => this.getStatus(), 2000);
    document.addEventListener('keydown', e => e.key === ' ' && this.playPause());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status.playerState === PLAY && !this.statusTimeoutId) this.getStatus();
    else if (nextProps.status.playerState !== PLAY && this.statusTimeoutId) {
      clearTimeout(this.statusTimeoutId);
      this.statusTimeoutId = null;
    }
  }

  getStatus() {
    this.props.getStatus();

    this.statusTimeoutId = setTimeout(() => {
      if (this.props.status.playerState !== PLAY) return;
      this.getStatus();
    }, 1000) as any; //because the type system went stupid
  }

  playPause() {
    if (this.props.status.playerState === PLAY) this.props.pause();
    if (this.props.status.playerState === PAUSE) this.props.resume();
  }

  render() {
    const { start } = this.props;

    return <FileUpload
      start={start}
    >
      <div style={styles.parent}>
        <div style={styles.top}>
          <div style={{ width: '20%' }}>
            <FileStructure />
          </div>

          <div style={{ width: '60%' }}>
            <div style={{ marginLeft: '1rem' }}>Explorer</div>
          </div>

          <div style={{ width: '20%' }}>
            Currently Playing
          </div>
        </div>

        <div style={styles.bottom}>
          <Controls />
        </div>
      </div>
    </FileUpload>;
  }
}

export default connect(
  state => ({
    //@ts-ignore
    status: state.status,
  }),
  {
    getStatus,
    start,
    resume,
    pause,
  }
)(App);

const styles = {
  bottom: {
    alignSelf: 'flex-end',
    width: '100%',
  } as React.CSSProperties,
  chromecastButton: {
    float: 'right',
    height: '2.5rem',
    margin: '1rem',
    width: '2.5rem',
  } as React.CSSProperties,
  parent: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  } as React.CSSProperties,
  top: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    width: '100%',
  } as React.CSSProperties,
};