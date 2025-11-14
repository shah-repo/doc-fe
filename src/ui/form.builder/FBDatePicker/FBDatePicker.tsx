import MomentUtils from '@date-io/moment';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FBInput } from '..';
import { ReactComponent as DatePickerIcon } from '../../../assets/images/formBuilder/DatePickerIcon.svg';
import { MomentFormats, useDate } from '../../../common/utils/date';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBTextFieldStyles } from '../styles/FBTextField.styles';
import { FBDatePickerProps } from './FBDatePicker.types';
import { withDatePicker } from './FBDatePicker.wrap';

const DataPickerInput: React.FC<FBDatePickerProps> = ({
  datePickerState,
  onChange,
  onDatePickerClick,
  onDatePickerClose,
  onDatePickerClear,
  disablePastDates,
  ...props
}) => {
  const classes = FBTextFieldStyles();
  const { getCurrentDate, formatDisplayDate, timezone } = useDate();
  const currentDate = getCurrentDate(MomentFormats.YearMonthDateDash);
  const selectedDate = formatDisplayDate(datePickerState?.date);

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
            format={MomentFormats.MonthDateYearTwoDigit}
            autoOk={true}
            disablePast={disablePastDates}
            label=""
            value={datePickerState?.date ? moment.tz(datePickerState.date, timezone) : currentDate}
            initialFocusedDate={currentDate}
            onChange={(date, value) => onChange?.(date, value)}
            TextFieldComponent={(props) => (
              <TextField
                {...props}
                disabled={props.disabled}
                className={classes.textfield}
                inputProps={{ disabled: true }}
                value={selectedDate}
                InputProps={{
                  ...props.InputProps,
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        {datePickerState?.date && (
                          <IconButton
                            onClick={onDatePickerClear}
                            size="small"
                            disabled={props.disabled}
                            data-cy="date-clear"
                            aria-label="clear date"
                          >
                            <FontAwesomeIcon icon={regular('xmark')} />
                          </IconButton>
                        )}
                        {props?.InputProps?.endAdornment}
                      </InputAdornment>
                    </>
                  ),
                }}
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
