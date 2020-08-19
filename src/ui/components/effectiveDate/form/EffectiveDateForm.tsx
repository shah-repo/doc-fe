import { Button, withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import moment from "moment";
import * as React from "react";
import { TIME_ZONE, toStartOfDay } from "../../../../common/utils/date";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import DatePickerField from "../../forms/fields/DatePickerField";
import FormMessage from "../../forms/FormMessage";
import FormProgress from "../../forms/FormProgress";
import SubmitButton from "../../forms/SubmitButton";
import Text from "../../Text";
import styles from "./EffectiveDateForm.styles";

interface EffectiveDateFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
}

const EffectiveDateForm: React.FunctionComponent<EffectiveDateFormProps> = ({ cancel, classes, asyncState }) => (
  <Form className={classes.form}>
    <FormMessage asyncState={asyncState} />
    <DatePickerField
      label="transition.action.effective.date"
      name="effectiveDate"
      minDate={toStartOfDay(moment().tz(TIME_ZONE, true).toISOString())}
      value={toStartOfDay(moment().tz(TIME_ZONE, true).toISOString())}
    />
    <FormProgress asyncState={asyncState} />
    <SubmitButton
      id="confirmEffectiveDate"
      asyncState={asyncState}
      label="transition.action.confirm"
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

export default withStyles(styles)(EffectiveDateForm);
