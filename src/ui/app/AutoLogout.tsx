import * as React from "react";
import IdleTimer from 'react-idle-timer';
import useDialog from "../hooks/useDialog";

const AutoLogout: React.FunctionComponent = () => {
  const onIdle = () => { console.log("Idle"); };

  return (
    <IdleTimer
      element={document}
      onIdle={onIdle}
      debounce={250}
      timeout={10000}
    />
  );
}

export default AutoLogout;
