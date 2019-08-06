import React, { useState, useEffect } from "react";
import IdleTimer from 'react-idle-timer';
import useDialog from "../hooks/useDialog";
import useInterval from "../hooks/useInterval";
import { DialogAction } from "../components/dialogs/utils/types";
import Dialog from "../components/dialogs/Dialog";
import Text from "../components/Text";

const AutoLogout: React.FunctionComponent = () => {
  const logoutTime = 10;
  const [tickInterval, setTickInterval] = useState<number | null>(null);
  const [timerValue, updateTimerValue] = useState(logoutTime);
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
    updateTimerValue(10);
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
    }
  }, [timerValue])

  return (
    <React.Fragment>
      <IdleTimer
        element={document}
        onIdle={onIdle}
        debounce={250}
        timeout={5000}
        onActive={onActive}
      />
      <Dialog
        title={"common.warning"}
        contentRenderer={contentRenderer}
        dialogHandler={dialogHandler}
      />
    </React.Fragment>
  );
}

export default AutoLogout;
