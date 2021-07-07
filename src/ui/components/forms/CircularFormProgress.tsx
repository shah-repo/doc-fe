import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";

export interface FormProgressProps {
  asyncState: AsyncState;
}

type Props = FormProgressProps;

const CircularFormProgress: React.FunctionComponent<Props> = ({ asyncState  }) => {
  if (asyncState.status !== AsyncStatus.Active) {
    return null;
  }

  return (
    <CircularProgress size={20} />
  );
};

export default CircularFormProgress;
