import MomentUtils from "@date-io/moment";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { FBInput } from "..";
import { getStartOfDayDateString, TIME_ZONE } from "../../../common/utils/date";
import { FBDatePickerProps } from "./FBDatePicker.types";
import { withDatePicker } from "./FBDatePicker.wrap";

const FBDatePicker: React.FunctionComponent<FBDatePickerProps> = ({
  datePickerState,
  onChange,
  onDatePickerClick,
  onDatePickerClose,
  disablePastDates,
  ...props
}) => (
  <FBInput {...props} withState={true} type="datepicker" >
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
      <Observer>
        {() => (
          <KeyboardDatePicker
            onOpen={() => onDatePickerClick?.()}
            onClose={() => onDatePickerClose?.()}
            disabled={props.disabled}
            fullWidth={true}
            disableToolbar={true}
            invalidDateMessage=""
            variant="inline"
            inputVariant="outlined"
            format="MM/DD/YYYY"
            autoOk={true}
            disablePast={disablePastDates}
            label=""
            value={datePickerState?.date ?? ""}
            initialFocusedDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
            onChange={(date, value) => onChange?.(date, value)}
            TextFieldComponent={(props) => <TextField {...props} disabled={true} />}
          />
        )}
      </Observer>
    </MuiPickersUtilsProvider>
  </FBInput>
);


export default withDatePicker(FBDatePicker);
