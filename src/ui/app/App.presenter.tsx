import { Box, CircularProgress } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelectors } from '../../state/ducks/auth';
import { ApplicationState } from '../../state/reducers';
import { AsyncStatus } from '../../state/types';
import Routes from './Routes';

const AppPresenter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const pingServer = useCallback(() => dispatch(authActions.pingServer()), [dispatch]);
  const [showSpinner, toggleSpinner] = React.useState(true);
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const pingServerAsyncInfo = useSelector((state: ApplicationState) =>
    authSelectors.getPingServerAsyncState(state));

  useEffect(() => {
    if (pingServerAsyncInfo.status === AsyncStatus.Idle) {
      // Only ping if employeeId is set — multi-company users haven't selected
      // a company yet, so sending an empty employeeId triggers 401 → logoutUser loop.
      if (employeeId) {
        pingServer();
        toggleSpinner(true);
      } else {
        toggleSpinner(false);
      }
    }

    if (pingServerAsyncInfo.status === AsyncStatus.Success || pingServerAsyncInfo.status === AsyncStatus.Error) {
      setTimeout(() => {
        toggleSpinner(false);
      }, 500);
    }
  }, [pingServer, pingServerAsyncInfo, employeeId]);

  if (showSpinner) {
    return (
      <Box top="50%" right="50%" position="fixed" >
        <CircularProgress size={20} />
      </Box>
    );
  }
  return <Routes />;
};

export default AppPresenter;
