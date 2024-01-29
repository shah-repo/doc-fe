import MomentUtils from '@date-io/moment';
import { TextField } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FBInput } from '..';
import { ReactComponent as DatePickerIcon } from '../../../assets/images/formBuilder/DatePickerIcon.svg';
import { TIME_ZONE, getStartOfDayDateString } from '../../../common/utils/date';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBTextFieldStyles } from '../styles/FBTextField.styles';
import { FBDatePickerProps } from './FBDatePicker.types';
import { withDatePicker } from './FBDatePicker.wrap';

const DataPickerInput: React.FC<FBDatePickerProps> = ({
  datePickerState,
  onChange,
  onDatePickerClick,
  onDatePickerClose,
  disablePastDates,
  ...props
}) => {
  const classes = FBTextFieldStyles();
  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
      <Observer>
        {() => (
          <KeyboardDatePicker
            name={props.name}
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
            value={datePickerState?.date || ''}
            initialFocusedDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
            onChange={(date, value) => onChange?.(date, value)}
            TextFieldComponent={(props) => (
              <TextField
                {...props}
                disabled={props.disabled}
                className={classes.textfield}
                inputProps={{ disabled: true }}
              />
            )}
            keyboardIcon={<DatePickerIcon />}
          />
        )}
      </Observer>
    </MuiPickersUtilsProvider>
  );
};

const FBDatePicker: React.FunctionComponent<FBDatePickerProps> = (props) => (
  <FBInput {...props} withState type="datepicker" labelProps={FBFontStyle.labelProps}>
    <DataPickerInput {...props} />
  </FBInput>
);

export default withDatePicker(FBDatePicker);
