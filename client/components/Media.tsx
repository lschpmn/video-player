import * as React from 'react';
import { connect } from 'react-redux';
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
    if (!prevProps.chromecastStore.chromecasts[0] && this.props.chromecastStore.chromecasts[0]) {
      this.props.connectAction(this.props.chromecastStore.chromecasts[0].host);
    }
  }

  render() {
    const { chromecastStore } = this.props;
    const name = chromecastStore.chromecasts[0] && chromecastStore.chromecasts[0].name;

    return <div>
      Chromecasts: {name}
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
