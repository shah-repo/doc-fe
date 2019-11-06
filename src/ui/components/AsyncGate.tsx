import { Button, LinearProgress, Typography, WithStyles, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { AsyncState, AsyncStatus } from "../../state/types";
import useDidMount from "../hooks/useDidMount";
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
  const didMount = useDidMount();

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

  if (asyncState.status === AsyncStatus.Success && didMount) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  if (asyncState.status === AsyncStatus.Error) {
    const button = asyncAction && (
      <Button
        variant="outlined"
        onClick={runAsyncAction}
        className={classes.tryAgainButton}
      >
        <Text translation="errors.fetch.tryAgain" />
      </Button>
    );

    return (
      <div className={classes.errorContainer}>
        <Typography variant="body1" color="error">
          {asyncState.message}
        </Typography>
        {button}
      </div>
    );
  }

  return <LinearProgress className={classes.progress} />;
};

export default withStyles(styles)(AsyncGate);
