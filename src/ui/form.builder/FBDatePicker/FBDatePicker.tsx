import MomentUtils from '@date-io/moment';
import { IconButton, InputAdornment, Popper, PopperProps, TextField } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FBInput } from '..';
import { ReactComponent as DatePickerIcon } from '../../../assets/images/formBuilder/DatePickerIcon.svg';
import { ReactComponent as ClearIcon } from '../../../assets/images/formBuilder/add_icon.svg';
import { TIME_ZONE, getStartOfDayDateString } from '../../../common/utils/date';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBTextFieldStyles } from '../styles/FBTextField.styles';
import { FBDatePickerProps } from './FBDatePicker.types';
import { withDatePicker } from './FBDatePicker.wrap';

// TODO remove after upgrading MUI
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DatepickerPopper: React.FC<PopperProps> = ({ children, ...props }) => (
  <Popper
    {...props}
    modifiers={{
      keepTogether: {
        enabled: true,
      },
    }}
  >
    {children}
  </Popper>
);

const DataPickerInput: React.FC<FBDatePickerProps> = ({
  datePickerState,
  onChange,
  onDatePickerClick,
  onDatePickerClose,
  disablePastDates,
  setIsOpen,
  isOpen,
  ...props
}) => {
  const classes = FBTextFieldStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClear = () => {
    if (onChange) {
      onChange(null, null); // Clear the value
    }
  };
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
            KeyboardButtonProps={{
              'aria-label': 'open calendar',
            }}
            PopoverProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              PaperProps: {
                style: {
                  marginTop: '8px', // Adjust position
                },
              },
            }}
            clearable={true}
            open={isOpen}
            TextFieldComponent={(props) => (
              <TextField
                {...props}
                disabled={props.disabled}
                className={classes.textfield}
                inputProps={{ disabled: true }}
                InputProps={{
                  ...props.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClear} size="small" aria-label="clear date">
                        <ClearIcon />
                      </IconButton>
                      <IconButton onClick={() => setIsOpen?.(!isOpen)} size="small" aria-label="open calendar">
                        <DatePickerIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            // keyboardIcon={<DatePickerIcon />}
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
