import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import IdleTimer from 'react-idle-timer';
import useDialog from "../hooks/useDialog";
import useInterval from "../hooks/useInterval";
import { DialogAction } from "../components/dialogs/utils/types";
import Dialog from "../components/dialogs/Dialog";
import Text from "../components/Text";
import { authActions } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import AutoLogoutDialog from "./AutoLogoutDialog";

interface DispatchProps {
  logout: () => void;
}

type Props = DispatchProps;

const AutoLogout: React.FunctionComponent<Props> = ({
  logout,
}) => {
  const timeout = 15000;
  const dialogHandler = useDialog();

  const onIdle = () => {
    dialogHandler.open();
  };

  const onActive = () => {
    dialogHandler.close();
  }

  const throttled = _.throttle(() => {
    console.log(new Date());
  }, 10000)

  const onAction = () => {
    throttled();
  }

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
}

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  logout: authActions.logout,
})(AutoLogout);
