import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import moment from "moment";
import * as React from "react";
import { ReactComponent as ScheduleIcon } from "../../../../../../../assets/images/ScheduleIcon.svg";
import { getStartOfDayDateString, TIME_ZONE } from "../../../../../../../common/utils/date";
import { AsyncState } from "../../../../../../../state/types";
import DatePickerStaticField from "../../../../../../components/forms/fields/DatePickerStaticField";
import { required, validator } from "../../../../../../components/forms/fields/validators/index";
import FormMessage from "../../../../../../components/forms/FormMessage";
import FormProgress from "../../../../../../components/forms/FormProgress";
import SubmitButton from "../../../../../../components/forms/SubmitButton";
import Text from "../../../../../../components/Text";
import styles from "./EffectiveDateForm.styles";

interface EffectiveDateFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
}
const EffectiveDateForm: React.FunctionComponent<EffectiveDateFormProps> = ({ cancel, classes, asyncState }) => (
  <Form className={classes.form}>
    <FormMessage asyncState={asyncState} />
    <Box className={classes.pendingBox}>
      <DatePickerStaticField
        name="effectiveDate"
        minDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
        value={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
        validate={validator(required)}
      />
    </Box>
    <FormProgress asyncState={asyncState} />
    <Grid container className={classes.closeLaterDiscription} justify="space-between">
      <Grid zeroMinWidth item={true}>
        <ScheduleIcon  className={classes.ScheduleIcon}/>
        <Text translation="transition.action.close.date.discription" />
        {"10/28/2021"}
      </Grid>
      <Grid zeroMinWidth item={true}>
        <SubmitButton
          id="confirmEffectiveDate"
          asyncState={asyncState}
          label="transition.action.confirm.close.later"
          fullWidth={false}
          className={classes.closeLaterSubmitButton}
        />
      </Grid>
    </Grid>
  </Form>
);

export default withStyles(styles)(EffectiveDateForm);
