import MomentUtils from "@date-io/moment";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import React from "react";
import { FBInput } from "..";
import { getStartOfDayDateString, TIME_ZONE } from "../../../common/utils/date";
import { FBDatePickerProps } from "./FBDatePicker.types";
import { withDatePicker } from "./FBDatePicker.wrap";

const FBDatePicker: React.FunctionComponent<FBDatePickerProps> = ({
  onChange = () => null,
  onDatePickerClick,
  onDatePickerClose,
  value,
  disablePastDates,
  ...props
}) => (
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
    <FBInput {...props} withState={true} type="datepicker" >
      <KeyboardDatePicker
        onClick={() => onDatePickerClick?.()}
        onClose={() => onDatePickerClose?.()}
        fullWidth={true}
        disableToolbar={true}
        invalidDateMessage=""
        variant="inline"
        inputVariant="outlined"
        format="MM/DD/YYYY"
        autoOk={true}
        disablePast={disablePastDates}
        label=""
        value={getStartOfDayDateString(moment(value as Date).tz(TIME_ZONE).toISOString())}
        initialFocusedDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
        {...{ onChange }}
        TextFieldComponent={(props) => <TextField {...props} disabled={true} />}
      />
    </FBInput>
  </MuiPickersUtilsProvider>
);


export default withDatePicker(FBDatePicker);
