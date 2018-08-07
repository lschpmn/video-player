'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { getStatus, PLAY, pause, PAUSE, resume, start } from './lib/player-actions';
import Controls from './components/Controls';
import FileStructure from './components/FileStructure';
import FileUpload from './components/FileUpload';

type Props = {
  getStatus: () => void,
  pause: () => void,
  resume: () => void,
  start: (path: string) => void,
  status: any,
};

type State = {
  statusTimeoutId: number,
};

class App extends React.Component<Props, State> {
  state = {
    statusTimeoutId: null,
  };

  componentDidMount() {
    this.getStatus();
    document.addEventListener('keydown', e => e.key === ' ' && this.playPause());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status.playerState === PLAY && !this.state.statusTimeoutId) this.getStatus();
    else if (nextProps.status.playerState !== PLAY && this.state.statusTimeoutId) {
      clearTimeout(this.state.statusTimeoutId);
      this.setState({
        statusTimeoutId: null,
      });
    }
  }

  getStatus() {
    this.props.getStatus();

    const id = setTimeout(() => {
      if (this.props.status.playerState !== PLAY) return;
      this.getStatus();
    }, 1000) as any; //because the type system went stupid

    this.setState({
      statusTimeoutId: id,
    });
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
  state => state,
  {
    getStatus: () => ({type: 'wtf do you want?'}),
    start,
  }
// @ts-ignore
)(App);

const styles: { [s:string]: React.CSSProperties } = {
  bottom: {
    alignSelf: 'flex-end',
    width: '100%',
  },

  parent: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  top: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    width: '100%',
  },
};