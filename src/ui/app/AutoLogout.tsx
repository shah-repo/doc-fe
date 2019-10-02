import _ from "lodash";
import React, { useEffect } from "react";
import IdleTimer from "react-idle-timer";
import { connect } from "react-redux";
import Config from "../../config";
import { authActions } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import useDialog from "../hooks/useDialog";
import AutoLogoutDialog from "./AutoLogoutDialog";

interface DispatchProps {
  pingServer: typeof authActions.pingServer;
}

type Props = DispatchProps;

const AutoLogout: React.FunctionComponent<Props> = ({
  pingServer,
}) => {
  const timeout = Config.AutoLogoutTime;
  const tenMinutes = 1000 * 60 * 10;
  const dialogHandler = useDialog();

  useEffect(() => {
    pingServer();
  }, []);

  const onIdle = () => {
    dialogHandler.open();
  };

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
    <React.Fragment>
      <IdleTimer
        element={document}
        debounce={250}
        timeout={timeout}
        onActive={onActive}
        onAction={onAction}
        onIdle={onIdle}
      />
      {dialogHandler.isOpen && <AutoLogoutDialog dialogHandler={dialogHandler} />}
    </React.Fragment>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  pingServer: authActions.pingServer,
})(AutoLogout);
