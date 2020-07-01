import { LinearProgress, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import styles from "./FormProgress.styles";

export interface FormProgressProps {
  asyncState: AsyncState;
  fullWidth?: boolean;
}

type Props = FormProgressProps & WithStyles<typeof styles>;

const FormProgress: React.FunctionComponent<Props> = ({ classes, asyncState, fullWidth }) => {
  if (asyncState.status !== AsyncStatus.Active) {
    return null;
  }

  return (
    <LinearProgress className={classes.progress} style={{ width: fullWidth ? "100%" : undefined }} />
  );
};

export default withStyles(styles)(FormProgress);
