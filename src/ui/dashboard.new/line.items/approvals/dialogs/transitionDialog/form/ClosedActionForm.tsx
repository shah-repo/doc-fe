import {
  Button,
  Grid,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../../../../../state/types";
import FormMessage from "../../../../../../components/forms/FormMessage";
import FormProgress from "../../../../../../components/forms/FormProgress";
import SubmitButton from "../../../../../../components/forms/SubmitButton";
import Text from "../../../../../../components/Text";
import styles from "./ClosedActionForm.styles";

interface ClosedActionFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
  arId?: string;
  title?: string;
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
    <Grid container={true} className={classes.pendingBox}>
      <Grid item={true}>
        <Typography
          component="span"
          variant="body2"
          className={classes.typography}
          color="textPrimary"
          noWrap
        >
          {arId}
        </Typography>
        &nbsp;
      </Grid>
      <Grid zeroMinWidth item={true} className={classes.truncateText}>
        <Typography
          component="span"
          variant="caption"
          className={classes.typographyBold}
          color="textSecondary"
          noWrap
        >
          {title}
        </Typography>
        &nbsp;
      </Grid>
      <Grid zeroMinWidth item={true}>
        <Text translation="transition.action.cancel.discription" />
      </Grid>
    </Grid>

    <FormProgress asyncState={asyncState} />
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
