import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputBaseProps, InputProps, useFormControl } from '@material-ui/core';
import formControlState from '@material-ui/core/FormControl/formControlState';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { omit } from 'lodash';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { TextField } from '..';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './Autocomplete.styles';
import { AutocompleteProps } from './Autocomplete.types';

const AutocompleteControl: React.FC<InputBaseProps & { InputProps: InputProps }> = ({
  autoFocus = false,
  defaultValue,
  disabled,
  id,
  inputProps,
  InputProps,
  inputRef,
  multiline = false,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  value,
  error,
}) => (
  <TextField
    autoComplete="search-term"
    autoFocus={autoFocus}
    defaultValue={defaultValue}
    multiline={multiline}
    disabled={disabled}
    error={error}
    name={name}
    value={value}
    id={id}
    inputRef={inputRef}
    onBlur={onBlur}
    onChange={onChange}
    onFocus={onFocus}
    placeholder={placeholder}
    inputProps={inputProps}
    {...InputProps}
  />
);

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  classes,
  onBlur,
  placeholder,
  inputProps,
  ChipProps = { size: 'small' },
  ...props
}, ref: MutableRefObject<HTMLDivElement>) => {
  const baseClasses = useStyles();
  const muiFormControl = useFormControl();
  const controlState = formControlState({
    props,
    muiFormControl,
    states: ['disabled', 'error'],
  });
  const [blurEvent, setBlurEvent] = useState<React.FocusEvent<HTMLUnknownElement>>();

  useEffect(() => {
    if (blurEvent && onBlur) {
      if (blurEvent.target) {
        onBlur(blurEvent);
      }
      setBlurEvent(undefined);
    }
  }, [blurEvent, onBlur]);

  return (
    <MuiAutocomplete
      {...props}
      ref={ref}
      disabled={controlState.disabled}
      classes={{
        ...omit(baseClasses, 'disabled'),
        ...classes,
      }}
      popupIcon={<FontAwesomeIcon icon={solid('angle-down')} />}
      onBlur={(event) => {
        event.persist();
        setBlurEvent(event);
      }}
      renderInput={(params) => (
        <AutocompleteControl
          {...params}
          InputProps={{
            ...params.InputProps,
            ...inputProps,
          }}
          name={name}
          error={controlState.error}
          disabled={controlState.disabled}
          placeholder={placeholder}
        />
      )}
      ChipProps={ChipProps}
    />
  );
};

export default withThemeNext(React.forwardRef(Autocomplete));
