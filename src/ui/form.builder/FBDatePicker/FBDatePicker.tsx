import DateFnsUtils from "@date-io/date-fns";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { FBInput, FBInputProps } from "..";

const FBDatePicker: React.FunctionComponent<FBInputProps> = ({
  onChange = () => {},
  value,
  ...props
}) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <FBInput {...props} {...{ onChange }} type="datepicker">
      <KeyboardDatePicker
        fullWidth={true}
        disableToolbar={true}
        invalidDateMessage=""
        variant="inline"
        inputVariant="outlined"
        format="MM/dd/yyyy"
        autoOk={true}
        label=""
        value={value as Date}
        {...{ onChange }}
        TextFieldComponent={(props) => <TextField {...props} disabled={true} />}
      />
    </FBInput>
  </MuiPickersUtilsProvider>
);

export default FBDatePicker;
