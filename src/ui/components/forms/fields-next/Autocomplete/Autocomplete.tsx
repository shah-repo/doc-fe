import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputBaseProps, InputProps, useFormControl } from "@material-ui/core";
import formControlState from "@material-ui/core/FormControl/formControlState";
import MuiAutocomplete from "@material-ui/lab/Autocomplete";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { TextField } from "..";
import { withThemeNext } from "../../../../layout/theme-next";
import useStyles from "./Autocomplete.styles";
import { AutocompleteProps } from "./Autocomplete.types";

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
  <>
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
  </>
);

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  onBlur,
  placeholder,
  ChipProps = { size: "small" },
  ...props
}) => {
  const classes = useStyles();
  const muiFormControl = useFormControl();
  const controlState = formControlState({
    props,
    muiFormControl,
    states: ["disabled", "error"],
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
      disabled={controlState.disabled}
      classes={omit(classes, "disabled")}
      popupIcon={<FontAwesomeIcon icon={solid("angle-down")} />}
      onBlur={(event) => {
        event.persist();
        setBlurEvent(event);
      }}
      renderInput={(params) => (
        <AutocompleteControl
          {...params}
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
