import { InputAdornment } from '@material-ui/core';
import React from 'react';
import { FBInputProps, FBTextField } from '..';

const ADDITIONAL_SETTINGS = 'editor-additions';

interface Props extends FBInputProps {
  [ADDITIONAL_SETTINGS]: Record<string, unknown>
}

const FBNumericField: React.FunctionComponent<Props> = ({
  ...props
}) => {
  const prefix = props[ADDITIONAL_SETTINGS].prefix;
  const suffix = props[ADDITIONAL_SETTINGS].suffix;

  const InputProps = {
    inputProps: {
      min: props[ADDITIONAL_SETTINGS].min,
      step: props[ADDITIONAL_SETTINGS].step,
    },
    startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : undefined,
    endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : undefined,
  };
  return <FBTextField {...props} type="number" InputProps={InputProps} />;
};

export default FBNumericField;
