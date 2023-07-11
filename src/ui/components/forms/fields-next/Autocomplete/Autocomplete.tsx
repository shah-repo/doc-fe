import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormControl } from '@material-ui/core';
import formControlState from '@material-ui/core/FormControl/formControlState';
import MuiAutocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import { omit } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { TextField } from '..';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './Autocomplete.styles';
import { AutocompleteInputProps, AutocompleteProps } from './Autocomplete.types';

const AutocompleteControl: React.FC<AutocompleteInputProps> = ({
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
  size,
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
    size={size}
    {...InputProps}
  />
);

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  classes,
  onBlur,
  placeholder,
  inputProps,
  size,
  filterOptions,
  getOptionLabel,
  ChipProps = { size: 'small' },
  ...props
}) => {
  const baseClasses = useStyles();
  const muiFormControl = useFormControl();
  const controlState = formControlState({
    props,
    muiFormControl,
    states: ['disabled', 'error'],
  });
  const [blurEvent, setBlurEvent] = useState<React.FocusEvent<HTMLUnknownElement>>();

  const isSmall = size === 'small';
  const hasClearIcon = !props.disableClearable;

  // TODO this is workaround for incorrect filtering, remove after upgrading MUI
  const internalFilterOptions = useMemo(() => getOptionLabel ? createFilterOptions({
    stringify: getOptionLabel,
  }) : undefined, [getOptionLabel]);

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
      disabled={controlState.disabled}
      classes={{
        ...omit(baseClasses, 'disabled', 'sizeSmall', 'optionSmall', 'withClearIcon', 'smallWithClearIcon'),
        ...classes,
        inputRoot: cx(
          baseClasses.inputRoot,
          {
            [baseClasses.sizeSmall]: isSmall,
            [baseClasses.withClearIcon]: hasClearIcon,
            [baseClasses.sizeSmall]: isSmall,
            [baseClasses.smallWithClearIcon]: hasClearIcon && isSmall,
          },
        ),
        option: cx(baseClasses.option, { [baseClasses.optionSmall]: isSmall }),
      }}
      size={size}
      popupIcon={<FontAwesomeIcon icon={solid('angle-down')} />}
      onBlur={(event) => {
        event.persist();
        setBlurEvent(event);
      }}
      getOptionLabel={getOptionLabel}
      filterOptions={filterOptions ?? internalFilterOptions}
      renderInput={(params) => (
        <AutocompleteControl
          {...params}
          InputProps={{
            ...params.InputProps,
            ...inputProps,
          }}
          size={size}
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

export default withThemeNext(Autocomplete);
