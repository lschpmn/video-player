import * as React from 'react';
import { connect } from 'react-redux';
import { getChromecasts } from '../lib/player-actions';
import { ChromecastStoreState, ReducerState } from '../types';

type Props = {
  chromecastStore: ChromecastStoreState,
  getChromecasts: typeof getChromecasts,
};

class Media extends React.Component<Props> {
  componentDidMount() {
    this.props.getChromecasts();
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
    getChromecasts,
  }
)(Media);
