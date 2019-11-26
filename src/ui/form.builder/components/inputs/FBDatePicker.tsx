import DateFnsUtils from "@date-io/date-fns";
import { Box } from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

type Props =
  & KeyboardDatePickerProps
  & FBFormDefaultProps
  & FBOnChangeProps;

const FBDatePicker: React.FunctionComponent<Props> = ({
  labelRenderer,
  helperText,
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
        autoOk={true}
        label=""
      />
       <Box mt={3} pl={1.5} fontSize="caption.fontSize" color="error.main">{helperText}</Box>
    </MuiPickersUtilsProvider>
  </Box>
);

export default withOnChange(withLabelRenderer(FBDatePicker));
