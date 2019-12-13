import _ from "lodash";
import React, { useEffect } from "react";
import IdleTimer from "react-idle-timer";
import { connect } from "react-redux";
import { authActions } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import useDialog from "../hooks/useDialog";

interface DispatchProps {
  pingServer: typeof authActions.pingServer;
}

type Props = DispatchProps;

const PingServer: React.FunctionComponent<Props> = ({
  pingServer,
}) => {
  const tenMinutes = 1000 * 60 * 10;
  const dialogHandler = useDialog();

  useEffect(() => {
    pingServer();
  }, []);

  const onActive = () => {
    dialogHandler.close();
  };

  const pingEveryTenMinutes = _.throttle(() => {
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

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  pingServer: authActions.pingServer,
})(PingServer);
