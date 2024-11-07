import { Box, Button, LinearProgress, Typography, WithStyles, withStyles } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { ReactComponent as NoAccessIcon } from '../../assets/images/NoAccess_Image.svg';
import { AsyncState, AsyncStatus } from '../../state/types';
import useDidMount from '../hooks/useDidMount';
import styles from './AsyncGate.styles';
import Text from './Text';

export interface AsyncGateProps {
  asyncState: AsyncState
  asyncAction?: (...args: any[]) => any
  startActionOnMount?: boolean
  passive?: boolean
}

type Props = AsyncGateProps & WithStyles<typeof styles>;

const AsyncGate: React.FunctionComponent<Props> = ({
  asyncState,
  children,
  classes,
  asyncAction,
  startActionOnMount = false,
  passive = false,
}) => {
  const didMount = useDidMount();

  const runAsyncAction = useCallback(() => {
    if (asyncAction) {
      asyncAction();
    }
  }, [asyncAction]);

  useEffect(() => {
    if (startActionOnMount) {
      runAsyncAction();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startActionOnMount]);

  if (passive && didMount && [AsyncStatus.Active, AsyncStatus.Success].includes(asyncState.status)) {
    return (
      <div className={classes.passiveContainer}>
        {asyncState.status === AsyncStatus.Active && (
          <LinearProgress className={classes.passiveProgress} />
        )}
        {children}
      </div>
    );
  }

  if (asyncState.status === AsyncStatus.Success && didMount) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  if (asyncState.status === AsyncStatus.Error && asyncState.statusCode === 403) {
    return (
      <div className={classes.errorAccessDeniedContainer}>
        <NoAccessIcon />
        <Box className={classes.accessDeniedText}>
          <Text translation="async.state.message.access.denied" />
        </Box>
        <Typography variant="body1" className={classes.errorText}>
          {asyncState.message}
        </Typography>
      </div>
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
