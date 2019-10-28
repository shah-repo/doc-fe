
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { authActions } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import Dialog from "../components/dialogs/Dialog";
import Text from "../components/Text";
import { DialogHandler } from "../hooks/useDialog";
import useInterval from "../hooks/useInterval";

interface OwnProps {
  dialogHandler: DialogHandler;
}

interface DispatchProps {
  logout: () => void;
}

type Props = OwnProps & DispatchProps;

const AutoLogoutDialog: React.FunctionComponent<Props> = ({
  dialogHandler, logout,
}) => {
  const [timerValue, updateTimerValue] = useState(20);
  useEffect(() => {
    if (timerValue === 0) {
      dialogHandler.close();
      logout();
    }
  }, [timerValue]);
  const contentRenderer = () => {
    return (
      <div>
        <Text translation="autoLogout.timer" values={{ time: timerValue }} />
      </div>
    );
  };

  useInterval(() => {
    updateTimerValue(timerValue - 1);
  }, 1000);

  return (
    <Dialog
      title={"common.warning"}
      contentRenderer={contentRenderer}
      dialogHandler={dialogHandler}
    />
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  logout: authActions.logout,
})(AutoLogoutDialog);
