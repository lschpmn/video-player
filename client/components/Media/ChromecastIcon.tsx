import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CastIcon from '@material-ui/icons/Cast';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import React, { useCallback, useState } from 'react';
import { ChromecastStoreState } from '../../types';


type Props = {
  chromecastStore: ChromecastStoreState,
};

export const ChromecastIcon = ({ chromecastStore }: Props) => {
  const [anchorEl, setAnchorEl] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = chromecastStore.chromecasts[0] && chromecastStore.chromecasts[0].name;

  const toggleMenu = useCallback(() => setMenuOpen(!menuOpen), [menuOpen]);

  return <div>
    {chromecastStore.isConnected
      ? chromecastStore.mediaStatus
        ? <CastConnectedIcon ref={setAnchorEl} onClick={toggleMenu} color="primary" style={styles.icon}/>
        : <CastIcon ref={setAnchorEl} onClick={toggleMenu} color="secondary" style={styles.icon}/>
      : <CastIcon ref={setAnchorEl} onClick={toggleMenu} color="error" style={styles.icon}/>}

    <div style={styles.name}>{name}</div>
    <Menu
      anchorEl={anchorEl}
      onClose={toggleMenu}
      open={menuOpen}
    >
      <MenuItem>Cast Default Background</MenuItem>
    </Menu>
  </div>;
};

const styles = {
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
