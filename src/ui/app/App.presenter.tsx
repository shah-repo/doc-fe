import { Box, CircularProgress } from "@material-ui/core";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import { AsyncStatus } from "../../state/types";
import Routes from "./Routes";

const AppPresenter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const pingServer = useCallback(() => dispatch(authActions.pingServer()), [dispatch]);
  const [showSpinner, toggleSpinner] = React.useState(true);

  const pingServerAsyncInfo = useSelector((state: ApplicationState) =>
    authSelectors.getPingServerAsyncState(state));

  useEffect(() => {
    if (pingServerAsyncInfo.status === AsyncStatus.Idle) {
      pingServer();
      toggleSpinner(true);
    }

    if (pingServerAsyncInfo.status === AsyncStatus.Success || pingServerAsyncInfo.status === AsyncStatus.Error) {
      setTimeout(() => {
        toggleSpinner(false);
      }, 500);
    }
  }, [pingServer, pingServerAsyncInfo]);

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
