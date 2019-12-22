import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CastIcon from '@material-ui/icons/Cast';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import React, { useCallback, useState } from 'react';
import { BACKDROP_RECEIVER_ID, DEFAULT_MEDIA_RECEIVER_ID } from '../../../constants';
import { launchApp } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ChromecastStoreState } from '../../types';

type Props = {
  chromecastStore: ChromecastStoreState,
};

export const ChromecastIcon = ({ chromecastStore }: Props) => {
  const launchAppAction = useAction(launchApp);
  const [anchorEl, setAnchorEl] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const isBackdrop = chromecastStore.selected?.appId === BACKDROP_RECEIVER_ID;
  const name = chromecastStore.selected?.name;

  const onClick = () => {
    launchAppAction(isBackdrop ? DEFAULT_MEDIA_RECEIVER_ID : BACKDROP_RECEIVER_ID);
    setMenuOpen(false);
  };

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
      open={menuOpen && !!chromecastStore.selected}
    >
      <MenuItem
        onClick={onClick}
      >
        {isBackdrop
          ? <>Cast Default Media Receiver</>
          : <>Cast Default Background</>
        }
      </MenuItem>
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
