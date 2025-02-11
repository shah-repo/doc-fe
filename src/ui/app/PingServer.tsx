import { throttle } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import IdleTimer from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelectors } from '../../state/ducks/auth';

const DEBOUNCE_EVENT_TIMEOUT = 250;
const IDLE_TIMEOUT = 1000 * 60 * 10;

const PingServer: React.FC = () => {
  const dispatch = useDispatch();
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const pingServer = useCallback(() => {
    if (currentEmployeeId) {
      dispatch(authActions.pingServer());
    }
  }, [dispatch, currentEmployeeId]);

  const handleActivity = useMemo(
    () => throttle(pingServer, IDLE_TIMEOUT, { trailing: false }),
    [pingServer],
  );

  useEffect(handleActivity, [handleActivity]);

  return (
    <IdleTimer
      element={document}
      timeout={IDLE_TIMEOUT}
      debounce={DEBOUNCE_EVENT_TIMEOUT}
      onActive={handleActivity}
      onAction={handleActivity}
    />
  );
};

export default PingServer;
