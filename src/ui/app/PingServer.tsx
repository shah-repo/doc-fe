import { throttle } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import IdleTimer from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelectors } from '../../state/ducks/auth';

const IDLE_TIMEOUT = 1000 * 60 * 10;

const PingServer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const pingServer = useCallback(() => {
    if (currentEmployeeId) {
      dispatch(authActions.pingServer());
    }
  }, [dispatch, currentEmployeeId]);

  useEffect(pingServer, [pingServer]);

  const handleActivity = useCallback(
    () => throttle(pingServer, IDLE_TIMEOUT),
    [pingServer],
  );

  return (
    <IdleTimer
      element={document}
      debounce={250}
      timeout={IDLE_TIMEOUT}
      onActive={handleActivity}
      onAction={handleActivity}
    />
  );
};

export default PingServer;
