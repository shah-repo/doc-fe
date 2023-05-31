import { Box, TextField } from '@material-ui/core';
import React from 'react';
import { FBInput, FBTextFieldProps } from '..';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBTextFieldStyles } from '../styles/FBTextField.styles';
import { withFBTextField } from './FBTextField.wrap';

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  onBlur,
  onFocus,
  FBProps: { inputType = 'textfield' } = {},
  placeholder = '',
  multiline,
  defaultValue,
  error,
  rows,
  type,
  inputProps,
  InputProps,
  style,
  dataCy,
  mode,
  className,
  value,
  customHeight,
  ...props
}) => {
  const classes = FBTextFieldStyles({ rows, customHeight });
  className = className || classes.textfield;
  return (
    <FBInput {...props} {...{ error, defaultValue }}
      type={inputType} labelProps={FBFontStyle.labelProps}>
      {mode === 'preview' && (
        <Box>{defaultValue}</Box>
      )}
      {mode !== 'preview' && (
        <TextField
          data-cy={dataCy || props.name}
          label=""
          variant="outlined"
          onBlur={(ev) => onBlur?.(ev)}
          onFocus={(ev) => onFocus?.(ev)}
          inputProps={{
            ...inputProps,
            ...(type === 'number') && {
              onWheel: (e) => { e.currentTarget.blur(); },
            },
          }}

          {...{
            type,
            rows,
            error,
            multiline,
            InputProps,
            style,
            placeholder,
            className,
            value,
          }}

        />
      )}
    </FBInput>
  );
};

export default withFBTextField(FBTextField);
