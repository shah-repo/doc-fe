import MomentUtils from "@date-io/moment";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import React from "react";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBDatePicker: React.FunctionComponent<FBInputProps> = ({
  onChange,
  ...props
}) => (
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
    <FBInput {...props} type="datepicker">
      <KeyboardDatePicker
        fullWidth={true}
        disableToolbar={true}
        variant="inline"
        invalidDateMessage=""
        inputVariant="outlined"
        format="MM/DD/YYYY"
        autoOk={true}
        label=""
        value=""
        onChange={(date) => onChange && onChange(null, date)}
        TextFieldComponent={(props) => <TextField {...props} disabled={true} />}
      />
    </FBInput>
  </MuiPickersUtilsProvider>
);

export default FBDatePicker;
