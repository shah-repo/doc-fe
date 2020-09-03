import { throttle } from "lodash";
import React, { useCallback, useEffect } from "react";
import IdleTimer from "react-idle-timer";
import { useDispatch } from "react-redux";
import { authActions } from "../../state/ducks/auth";
import useDialog from "../hooks/useDialog";

const PingServer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const pingServer = useCallback(() => dispatch(authActions.pingServer()), [dispatch]);
  const tenMinutes = 1000 * 60 * 10;
  const dialogHandler = useDialog();

  useEffect(() => {
    pingServer();
  }, [pingServer]);

  const onActive = () => {
    dialogHandler.close();
  };

  const pingEveryTenMinutes = throttle(() => {
    pingServer();
  }, tenMinutes);

  const onAction = () => {
    pingEveryTenMinutes();
  };

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
