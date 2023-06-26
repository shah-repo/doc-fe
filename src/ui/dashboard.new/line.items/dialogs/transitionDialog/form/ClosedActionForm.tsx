import {
  Button,
  Grid,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Form } from 'formik';
import * as React from 'react';
import { AsyncState, AsyncStatus } from '../../../../../../state/types';
import FormMessage from '../../../../../components/forms/FormMessage';
import SubmitButton from '../../../../../components/forms/SubmitButton';
import Text from '../../../../../components/Text';
import { StyleTooltip } from '../../../common/StyleTooltip';
import styles from './ClosedActionForm.styles';

interface ClosedActionFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState
  cancel: () => void
  arId?: string
  title?: string
}

const ClosedActionForm: React.FunctionComponent<ClosedActionFormProps> = ({
  cancel,
  classes,
  asyncState,
  arId,
  title,
}) => (
  <Form className={classes.form}>
    <FormMessage asyncState={asyncState} />
    <Grid
      container={true}
      className={classes.pendingBox}
      justify="flex-start"
      alignItems="center"
    >
      <Grid item={true}>
        <Typography
          component="span"
          variant="body2"
          className={classes.typography}
          color="textPrimary"
        >
          {arId}
        </Typography>
        &nbsp;
      </Grid>
      <Grid zeroMinWidth item={true}>
        <StyleTooltip title={title} placement="top" arrow>
          <Typography
            component="span"
            variant="caption"
            className={classes.typographyBold}
            color="textSecondary"
          >
            {title}
          </Typography>
        </StyleTooltip>
        &nbsp;
      </Grid>
      <Grid zeroMinWidth item={true}>
        <Typography
          component="span"
          variant="body2"
          className={classes.typography}
          color="textPrimary"
        >
          <Text translation="transition.action.cancel.description" />
        </Typography>
      </Grid>
    </Grid>
    <SubmitButton
      id="confirmEffectiveDate"
      asyncState={asyncState}
      label="transition.action.close.now"
      fullWidth={false}
      className={classes.submitButton}
    />
    <Button
      variant="text"
      color="secondary"
      className={classes.cancelButton}
      disabled={asyncState.status === AsyncStatus.Active}
      onClick={cancel}
    >
      <Text translation="transition.action.cancel" />
    </Button>
  </Form>
);

export default withStyles(styles)(ClosedActionForm);
