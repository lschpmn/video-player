import blue from '@material-ui/core/colors/blue';
import * as React from 'react';
import { connect } from 'react-redux';
import { MediaStatus } from '../types';
import Controls from './components/Controls';
import Explorer from './components/Explorer';
import FileStructure from './components/FileStructure';
import FileUpload from './components/FileUpload';
import Media from './components/Media';
import { getMediaStatus, launch, pause, play, PLAYING, seek } from './lib/player-actions';
import { ReducerState } from './types';
import Timeout = NodeJS.Timeout;

type Props = {
  getMediaStatus: typeof getMediaStatus,
  pause: typeof pause,
  play: typeof play,
  launch: typeof launch,
  mediaStatus: MediaStatus,
  seek: typeof seek,
};

class App extends React.Component<Props> {
  statusIntervalId?: Timeout;

  async componentDidMount() {
    document.addEventListener('keydown', e => {
      if (!this.props.mediaStatus) return;
      const { mediaStatus } = this.props;

      switch (e.key) {
        case ' ':
          this.playPause();
          return;
        case 'ArrowLeft':
          this.props.seek(mediaStatus.currentTime - 10);
          return;
        case 'ArrowRight':
          this.props.seek(mediaStatus.currentTime + 10);
          return;
      }
    });
  }

  componentDidUpdate(prevProps: Props) {
    const wasPlaying = prevProps.mediaStatus?.playerState === PLAYING;
    const isPlaying = this.props.mediaStatus?.playerState === PLAYING;
    if (wasPlaying && !isPlaying) {
      this.getMediaStatus(5000);
    } else if (!wasPlaying && isPlaying) {
      this.getMediaStatus(1000);
    } else if (!this.props.mediaStatus && this.statusIntervalId) {
      clearInterval(this.statusIntervalId);
      this.statusIntervalId = null;
    }
  }

  getMediaStatus(time: number) {
    this.statusIntervalId && clearInterval(this.statusIntervalId);
    this.statusIntervalId = setInterval(() => this.props.getMediaStatus(), time);
  }

  playPause() {
    if (this.props.mediaStatus?.playerState === PLAYING) this.props.pause();
    else this.props.play();
  }

  render() {
    return <FileUpload
      start={this.props.launch}
    >
      <div style={styles.parent}>
        <div style={styles.top} />
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
  }
}

export default connect(
  (state: ReducerState) => ({
    mediaStatus: state.chromecastStore.mediaStatus,
  }),
  {
    getMediaStatus,
    launch,
    pause,
    play,
    seek,
  }
)(App);

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
  top: {
    backgroundColor: blue['500'],
    display: 'flex',
    flexDirection: 'row',
    height: '3rem',
    width: '100%',
  } as React.CSSProperties,
};
