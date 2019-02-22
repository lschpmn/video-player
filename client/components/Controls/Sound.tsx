import VolumeUp from '@material-ui/icons/VolumeUp';
import Slider from 'material-ui/Slider';
import React, { Component } from 'react';

export default class Sound extends Component<any, any> {
  _id: any;
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  changeVolume(volume) {
    if (this._id) clearTimeout(this._id);

    this._id = setTimeout(() => this.props.changeVolume(volume), 200);
  }

  render() {
    const { level } = this.props.volume;
    
    return <div
      onMouseEnter={() => this.setState({show: true})}
      onMouseLeave={() => this.setState({show: false})}
      style={{...styles.container, ...this.props.style}}
    >

      {this.state.show &&
        <Slider
          axis={'y'}
          onChange={(e, val) => this.changeVolume(val)}
          style={styles.slider}
          sliderStyle={{marginTop: '1rem',}}
          value={level}
        />
      }

      <VolumeUp style={styles.icon} />
    </div>
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    width: '3rem',
  } as React.CSSProperties,
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    margin: '0 auto',
    width: '2rem',
  } as React.CSSProperties,
  slider: {
    backgroundColor: 'black',
    bottom: '3rem',
    height: '5rem',
    left: '1rem',
    opacity: 0.6,
    paddingBottom: '1rem',
    position: 'absolute',
  } as React.CSSProperties,
};