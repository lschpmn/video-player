import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CastIcon from '@material-ui/icons/Cast';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import * as React from 'react';
import { connect } from 'react-redux';
import { colors } from '../../constants';
import { connect as connectAction, getChromecasts, launch } from '../lib/player-actions';
import { ChromecastStoreState, ReducerState } from '../types';

type State = {
  showUrlField: boolean,
  url: string,
};

type Props = {
  chromecastStore: ChromecastStoreState,
  connectAction: typeof connectAction,
  getChromecasts: typeof getChromecasts,
  launch: typeof launch,
};

class Media extends React.Component<Props, State> {
  state = {
    showUrlField: false,
    url: '',
  };

  componentDidMount() {
    this.props.getChromecasts();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { chromecastStore: prevChromecastStore } = prevProps;
    const { chromecastStore } = this.props;

    if (!prevChromecastStore.chromecasts[0] && chromecastStore.chromecasts[0]
      || prevChromecastStore.loading && !chromecastStore.loading && !chromecastStore.isConnected) {
      setTimeout(() => this.props.connectAction(chromecastStore.chromecasts[0].host), 500);
    }

    if (!prevState.showUrlField && this.state.showUrlField) {
      document.addEventListener('keydown', this.onEnter);
    } else if (prevState.showUrlField && !this.state.showUrlField) {
      document.removeEventListener('keydown', this.onEnter);
    }
  }

  onEnter = ({ key }) => {
    if (key === 'Enter') {
      console.log(this.state.url);
      this.props.launch(this.state.url, true);
      this.setState({
        showUrlField: false,
        url: '',
      });
    }
  };

  render() {
    const { chromecastStore } = this.props;
    const name = chromecastStore.chromecasts[0] && chromecastStore.chromecasts[0].name;

    return <div style={styles.container}>
      {chromecastStore.isConnected
        ? chromecastStore.mediaStatus
          ? <CastConnectedIcon style={{ ...styles.icon, color: colors.blue }}/>
          : <CastIcon style={{ ...styles.icon, color: colors.green }}/>
        : <CastIcon style={{ ...styles.icon, color: colors.red }}/>}

      <div style={styles.name}>{name}</div>
      <div style={styles.name}>{chromecastStore.mediaStatus?.title}</div>
      <div style={styles.name}>{chromecastStore.mediaStatus?.subtitle}</div>

      <div style={{ flex: 1 }}/>

      {this.state.showUrlField
        ? <TextField
            label="URL"
            onBlur={() => this.setState({ showUrlField: false })}
            onChange={e => this.setState({ url: e.target.value })}
            style={styles.urlInput}
            variant="filled"
            value={this.state.url}
        />
        : <Button
            onMouseDown={() => this.setState({ showUrlField: true })}
            style={styles.urlInput}
            variant="contained"
        >
          Add URL
        </Button>
      }
    </div>;
  }
}

export default connect(
  (state: ReducerState) => ({
    chromecastStore: state.chromecastStore,
  }),
  {
    connectAction,
    getChromecasts,
    launch,
  },
)(Media);

const styles = {
  connectionStatus: {
    textAlign: 'center',
  } as React.CSSProperties,
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    wordBreak: 'break-all',
  } as React.CSSProperties,
  name: {
    textAlign: 'center',
    padding: '0.5rem',
  } as React.CSSProperties,
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    margin: '0 auto',
    padding: '0.5rem 0',
    width: '2rem',
  } as React.CSSProperties,
  urlInput: {
    height: '3rem',
    margin: '2rem 0',
  } as React.CSSProperties,
};
