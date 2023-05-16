import { throttle } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import IdleTimer from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelectors } from '../../state/ducks/auth';
import useDialog from '../hooks/useDialog';

const tenMinutes = 1000 * 60 * 10;

const PingServer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const pingServer = useCallback(() => dispatch(authActions.pingServer()), [dispatch]);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const dialogHandler = useDialog();

  useEffect(() => {
    if (currentEmployeeId) {
      pingServer();
    }
  }, [pingServer, currentEmployeeId]);

  const onActive = useCallback(() => {
    dialogHandler.close();
  }, [dialogHandler]);

  const pingEveryTenMinutes = useCallback(throttle(() => {
    if (currentEmployeeId) {
      pingServer();
    }
  }, tenMinutes), [currentEmployeeId]);

  const onAction = useCallback(() => {
    pingEveryTenMinutes();
  }, [pingEveryTenMinutes]);

  return (
    <IdleTimer
      element={document}
      debounce={250}
      onActive={onActive}
      onAction={onAction}
    />
  );
};

export default PingServer;
