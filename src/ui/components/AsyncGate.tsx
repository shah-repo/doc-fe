import { Button, LinearProgress, Typography, WithStyles, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { AsyncState, AsyncStatus } from "../../state/types";
import styles from "./AsyncGate.styles";
import Text from "./Text";

export interface AsyncGateProps  {
  asyncState: AsyncState;
  asyncAction?: (...args: any[]) => any;
  startActionOnMount?: boolean;
}

type Props = AsyncGateProps & WithStyles<typeof styles>;

const AsyncGate: React.FunctionComponent<Props> = ({
  asyncState,
  children,
  classes,
  asyncAction,
  startActionOnMount = false,
}) => {
  const runAsyncAction = () => {
    if (asyncAction) {
      asyncAction();
    }
  };

  useState(() => {
    if (startActionOnMount) {
      runAsyncAction();
    }
  });

  if (asyncState.status === AsyncStatus.Success) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  if (asyncState.status === AsyncStatus.Error) {
    return (
      <div className={classes.errorContainer}>
        <Typography variant="body1" color="error">
          {asyncState.message}
        </Typography>
        <Button
          hidden={!asyncAction}
          variant="outlined"
          onClick={runAsyncAction}
          className={classes.tryAgainButton}
        >
          <Text translation="errors.fetch.tryAgain" />
        </Button>
      </div>
    );
  }

  return <LinearProgress className={classes.progress} />;
};

export default withStyles(styles)(AsyncGate);
