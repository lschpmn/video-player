'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { getStatus, play, PLAY, pause, PAUSE, resume } from './lib/actions';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';

type Props = {
  getStatus: () => void,
  pause: () => void,
  play: boolean,
  resume: () => void,
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
    const { play, status } = this.props;
    console.log(status);
    
    return <FileUpload
      play={play}
    >
      <div style={styles.parent}>
    
        <div style={styles.top}>
          <h4>Playlist</h4>
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
  dispatch => ({
    getStatus: getStatus(dispatch),
    pause: pause(dispatch),
    play: play(dispatch),
    resume: resume(dispatch),
  })
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
    flexGrow: 1,
    width: '100%',
  },
};