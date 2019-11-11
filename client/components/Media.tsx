import CastIcon from '@material-ui/icons/Cast';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import * as React from 'react';
import { connect } from 'react-redux';
import { colors } from '../../constants';
import { connect as connectAction, getChromecasts } from '../lib/player-actions';
import { ChromecastStoreState, ReducerState } from '../types';

type Props = {
  chromecastStore: ChromecastStoreState,
  connectAction: typeof connectAction,
  getChromecasts: typeof getChromecasts,
};

class Media extends React.Component<Props> {
  componentDidMount() {
    this.props.getChromecasts();
  }

  componentDidUpdate(prevProps: Props) {
    const { chromecastStore: prevChromecastStore } = prevProps;
    const { chromecastStore } = this.props;

    if (!prevChromecastStore.chromecasts[0] && chromecastStore.chromecasts[0]
      || prevChromecastStore.loading && !chromecastStore.loading && !chromecastStore.isConnected) {
      setTimeout(() => this.props.connectAction(chromecastStore.chromecasts[0].host), 500);
    }
  }

  render() {
    const { chromecastStore } = this.props;
    const name = chromecastStore.chromecasts[0] && chromecastStore.chromecasts[0].name;

    return <div>
      {chromecastStore.isConnected
        ? chromecastStore.mediaStatus
          ? <CastConnectedIcon style={{ ...styles.icon, color: colors.blue }} />
          : <CastIcon style={{ ...styles.icon, color: colors.green }} />
        : <CastIcon style={{ ...styles.icon, color: colors.red }} />}
      <div style={styles.name}>{name}</div>
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
  }
)(Media);

const styles = {
  connectionStatus: {
    textAlign: 'center',
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
};
