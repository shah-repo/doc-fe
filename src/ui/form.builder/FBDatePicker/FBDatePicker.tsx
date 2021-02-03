import MomentUtils from "@date-io/moment";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import React from "react";
import { FBInput, FBInputProps } from "..";
import { getStartOfDayDateString, TIME_ZONE } from "../../../common/utils/date";

const FBDatePicker: React.FunctionComponent<FBInputProps> = ({
  onChange = () => null,
  value,
  ...props
}) => (
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
    <FBInput {...props} type="datepicker">
      <KeyboardDatePicker
        fullWidth={true}
        disableToolbar={true}
        invalidDateMessage=""
        variant="inline"
        inputVariant="outlined"
        format="MM/DD/YYYY"
        autoOk={true}
        label=""
        value={getStartOfDayDateString(moment(value as Date).tz(TIME_ZONE).toISOString())}
        initialFocusedDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
        {...{ onChange }}
        TextFieldComponent={(props) => <TextField {...props} disabled={true} />}
      />
    </FBInput>
  </MuiPickersUtilsProvider>
);

export default FBDatePicker;
