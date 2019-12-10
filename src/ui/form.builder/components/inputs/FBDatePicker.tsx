import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBDatePicker: React.FunctionComponent<FBInputProps> = ({
  onChange,
  value,
  ...props
}) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <FBInput {...props} type="datepicker">
        <KeyboardDatePicker
          fullWidth={true}
          disableToolbar={true}
          variant="inline"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          autoOk={true}
          label=""
          value={value as Date}
          onChange={(date) => onChange && onChange(null, date)}
        />
    </FBInput>
  </MuiPickersUtilsProvider>
);

export default FBDatePicker;
