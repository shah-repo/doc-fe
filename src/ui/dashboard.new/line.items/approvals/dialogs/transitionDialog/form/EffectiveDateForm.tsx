import { withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import moment from "moment";
import * as React from "react";
import { getStartOfDayDateString, TIME_ZONE } from "../../../../../../../common/utils/date";
import { AsyncState } from "../../../../../../../state/types";
import DatePickerField from "../../../../../../components/forms/fields/DatePickerField";
import { required, validator } from "../../../../../../components/forms/fields/validators/index";
import FormMessage from "../../../../../../components/forms/FormMessage";
import FormProgress from "../../../../../../components/forms/FormProgress";
import SubmitButton from "../../../../../../components/forms/SubmitButton";
// import Text from "../../../../../../components/Text";
import styles from "./EffectiveDateForm.styles";

interface EffectiveDateFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
}

const EffectiveDateForm: React.FunctionComponent<EffectiveDateFormProps> = ({ cancel, classes, asyncState }) => (
  <Form className={classes.form}>
    <FormMessage asyncState={asyncState} />
    <DatePickerField
      // label="transition.action.effective.date"
      name="effectiveDate"
      minDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
      value={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
      validate={validator(required)}
    />
    <FormProgress asyncState={asyncState} />
    <SubmitButton
      id="confirmEffectiveDate"
      asyncState={asyncState}
      label="transition.action.confirm.close.later"
      fullWidth={false}
      className={classes.closeLaterSubmitButton}
    />
  </Form>
);

export default withStyles(styles)(EffectiveDateForm);
