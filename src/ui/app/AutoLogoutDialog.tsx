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

const AutoLogoutDialog: React.FunctionComponent<Props> = ({
  logout,
}) => {

  return (
    <Dialog
      title={"common.warning"}
      contentRenderer={contentRenderer}
      dialogHandler={dialogHandler}
    />
  );
}

export default AutoLogoutDialog;
