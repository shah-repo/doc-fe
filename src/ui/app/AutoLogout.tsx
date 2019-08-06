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

interface DispatchProps {
  logout: () => void;
}

type Props = DispatchProps;

const AutoLogout: React.FunctionComponent<Props> = ({
  logout,
}) => {
  const timeout = 25000;
  const initialTimerValue = 10;
  const [tickInterval, setTickInterval] = useState<number | null>(null);
  const [timerValue, updateTimerValue] = useState(initialTimerValue);
  const dialogHandler = useDialog();
  const startInterval = () => setTickInterval(1000);
  const stopInterval = () => setTickInterval(null);

  const onIdle = () => {
    dialogHandler.open();
    startInterval();
  };

  const onActive = () => {
    dialogHandler.close();
    stopInterval();
    updateTimerValue(initialTimerValue);
  }

  const throttled = _.throttle(() => {
    console.log(new Date());
  }, 10000)

  const onAction = () => {
    throttled();
  }

  const contentRenderer = () => {
    return (
      <div>
        <Text translation="autoLogout.timer" values={{ time: timerValue }} />
      </div>
    )
  };

  useInterval(() => {
    updateTimerValue(timerValue - 1);
  }, tickInterval);

  useEffect(() => {
    if (timerValue === 0) {
      stopInterval();
      dialogHandler.close();
      logout();
    }
  }, [timerValue])

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
      <Dialog
        title={"common.warning"}
        contentRenderer={contentRenderer}
        dialogHandler={dialogHandler}
      />
    </React.Fragment>
  );
}

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  logout: authActions.logout,
})(AutoLogout);
