import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import T from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { removeServerEvent } from '../../lib/action-creators';
import { seek } from '../../lib/player-actions';
import { getTimeString, useAction } from '../../lib/utils';
import { ReducerState } from '../../types';

const ContinueModal = () => {
  const removeServerEventAction = useAction(removeServerEvent);
  const seekAction = useAction(seek);
  const [continueId, setContinueId] = useState(null);
  const continueEvents = useSelector((state: ReducerState) =>
    state.serverEvents.filter(e => e.type === 'continue'));
  const prev = continueEvents?.[0]?.payload;

  const clearContinueId = useCallback(() => {
    removeServerEventAction(continueId);
    setContinueId(null);
  }, [continueId]);

  const continuePrev = useCallback(() => {
    seekAction(prev);
    clearContinueId();
  }, [clearContinueId, prev]);

  useEffect(() => {
    if (!continueId && continueEvents.length) {
      setContinueId(continueEvents[0].id);
    } else if (continueEvents.length > 1) {
      removeServerEventAction(continueId);
      setContinueId(continueEvents[1].id);
    } else if (continueId && !continueEvents.length) {
      clearContinueId();
    }
  }, [clearContinueId, continueEvents.length]);

  useEffect(() => {
    if (continueId) {
      const id = setTimeout(() => clearContinueId(), 7500);

      return () => clearTimeout(id);
    }
  }, [clearContinueId]);

  return continueId && (
    <div style={styles.container}>
      <Card>
        <CardContent>
          Continue from {getTimeString(prev)}?
        </CardContent>
        <CardActions style={styles.cartActions}>
          <Button color='primary' variant='outlined' onClick={continuePrev}>
            Yes
          </Button>
          <T color='error'>
            <Button color='inherit' variant='outlined' onClick={clearContinueId}>
              No
            </Button>
          </T>
        </CardActions>
      </Card>
    </div>
  );
};

export default ContinueModal;

const styles = {
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.5)',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  } as React.CSSProperties,
  cartActions: {
    display: 'flex',
    justifyContent: 'space-between',
  } as React.CSSProperties,
};
