import { InputAdornment } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { FB, FBInputProps, FBTextField } from '..';

const ADDITIONAL_SETTINGS = 'editor-additions';

interface Props extends FBInputProps {
  [ADDITIONAL_SETTINGS]: Record<string, unknown>
}

const FBNumericField: React.FunctionComponent<Props> = ({
  ...props
}) => {
  const { formState } = FB.useStores();
  const prefix = props[ADDITIONAL_SETTINGS]?.prefix;
  const suffix = props[ADDITIONAL_SETTINGS]?.suffix;
  const fieldValue = props.defaultValue ?? formState?.getFieldValue(props.name);
  const defaultValue = fieldValue && `${prefix ?? ''}${fieldValue}${suffix ?? ''}`;

  const InputProps = {
    inputProps: {
      min: props[ADDITIONAL_SETTINGS].min,
      max: props[ADDITIONAL_SETTINGS].max,
      step: props[ADDITIONAL_SETTINGS].step,
    },
    startAdornment: prefix ? <InputAdornment position="start">{prefix as ReactNode}</InputAdornment> : undefined,
    endAdornment: suffix ? <InputAdornment position="end">{suffix as ReactNode}</InputAdornment> : undefined,
  };
  return <FBTextField {...props} type="number" InputProps={InputProps} defaultValue={defaultValue} />;
};

export default FBNumericField;
