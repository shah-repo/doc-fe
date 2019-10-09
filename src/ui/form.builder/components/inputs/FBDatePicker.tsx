import DateFnsUtils from "@date-io/date-fns";
import { Box } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBDatePickerProps } from "../../types/datepicker";

const FBDatePicker: React.FunctionComponent<FBDatePickerProps> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        fullWidth={true}
        disableToolbar={true}
        {...props}
        variant="inline"
        inputVariant="outlined"
        format="MM/dd/yyyy"
        label=""
      />
    </MuiPickersUtilsProvider>
  </Box>
);

export default withOnChange(withLabelRenderer(FBDatePicker));
