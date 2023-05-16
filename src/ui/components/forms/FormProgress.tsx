import { LinearProgress, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { AsyncState, AsyncStatus } from '../../../state/types';
import styles from './FormProgress.styles';

export interface FormProgressProps {
  asyncState: AsyncState;
  attached?: boolean;
}

type Props = FormProgressProps & WithStyles<typeof styles>;

const FormProgress: React.FunctionComponent<Props> = ({ classes, asyncState, attached }) => {
  if (asyncState.status !== AsyncStatus.Active) {
    return null;
  }

  return (
    <LinearProgress className={attached ? classes.progressAttached : classes.progress} />
  );
};

export default withStyles(styles)(FormProgress);
