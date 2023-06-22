import MomentUtils from '@date-io/moment';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, PopoverProps, TextFieldProps, useFormControl } from '@material-ui/core';
import formControlState from '@material-ui/core/FormControl/formControlState';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import cx from 'classnames';
import { omit } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { TextField } from '..';
import { MomentFormats } from '../../../../../common/utils/date';
import { withThemeNext } from '../../../../layout/theme-next';
import { useInputStyles, useStyles } from './Datepicker.styles';
import { DatePickerProps } from './Datepicker.types';

const PROPS_TO_SKIP: Array<keyof TextFieldProps> = [
  'onKeyUp',
  'variant',
  'contentEditable',
  'draggable',
  'spellCheck',
  'margin',
  'helperText',
];

const DatepickerTextField: React.FC<TextFieldProps> = ({
  onKeyDown,
  InputProps,
  ...props
}) => {
  const classes = useInputStyles();
  const suitableProps = omit(props, ...PROPS_TO_SKIP);

  return (
    <TextField
      onKeyDown={(e) => onKeyDown && onKeyDown(e as React.KeyboardEvent<HTMLDivElement>)}
      {...suitableProps}
      {...InputProps}
      endAdornment={
        <InputAdornment
          position="end"
          className={cx({ [classes.endAdorment]: !props.disabled, [classes.endAdormentDisabled]: props.disabled })}
        >
          <FontAwesomeIcon icon={regular('calendar-day')} />
        </InputAdornment>
      }
    />
  );
};

const DEFAULT_POPOVER_PROPS: Partial<PopoverProps> = {
  elevation: 2,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
};

const Datepicker: React.FC<DatePickerProps> = ({
  autoOk = true,
  disableToolbar = true,
  initialFocusedDate = null,
  format = MomentFormats.MonthDateYearTwoDigit,
  variant = 'inline',
  PopoverProps,
  onBlur,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const muiFormControl = useFormControl();
  const controlState = formControlState({
    props,
    muiFormControl,
    states: ['disabled', 'error', 'required'],
  });
  const [blurEvent, setBlurEvent] = useState<React.FocusEvent<HTMLUnknownElement>>();
  const [isClosed, setIsClosed] = useState(false);

  const finalPopoverProps = {
    ...DEFAULT_POPOVER_PROPS,
    ...PopoverProps,
    classes: {
      paper: classes.popover,
      ...PopoverProps?.classes,
    },
  };

  const handleClose = () => {
    if (blurEvent && onBlur) {
      setIsClosed(true);
    }
  };

  useEffect(() => {
    if (blurEvent && isClosed && onBlur) {
      onBlur(blurEvent);
    }
  }, [isClosed, blurEvent, onBlur]);

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={intl.locale}>
      <DatePicker
        {...props}
        onClose={handleClose}
        onBlur={(event) => {
          event.persist();
          if (onBlur) {
            setBlurEvent(event);
          }
        }}
        autoOk={autoOk}
        disableToolbar={disableToolbar}
        variant={variant}
        format={format}
        error={controlState.error}
        disabled={controlState.disabled}
        TextFieldComponent={DatepickerTextField}
        PopoverProps={finalPopoverProps}
        rightArrowIcon={<FontAwesomeIcon icon={regular('angle-right')} />}
        leftArrowIcon={<FontAwesomeIcon icon={regular('angle-left')} />}
      />
    </MuiPickersUtilsProvider>
  );
};

export default withThemeNext(Datepicker);
