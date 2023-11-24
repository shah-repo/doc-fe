import { Box, CircularProgress, FormControl, FormHelperText, InputLabel } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import Checkbox from '../Checkbox/Checkbox';
import { renderNode } from '../utils';
import useStyles from './FormField.styles';
import { FormFieldProps } from './FormField.types';

const FormField: React.FC<FormFieldProps> = ({
  prefix,
  suffix,
  children,
  loading,
  fullWidth = true,
  helperText,
  helperTextProps,
  label,
  labelProps,
  onFieldCheck,
  checkboxName,
  checked,
  ...props
}, ref) => {
  const classes = useStyles();

  return (
    <FormControl {...props} ref={ref} fullWidth={fullWidth}>
      {prefix}
      <Box display="flex" margin="0px 0px 8px">
      {onFieldCheck && (
        <Checkbox style={{ marginRight: '10px' }} {...{ checked }} name={checkboxName} onChange={onFieldCheck} />
      )}
      {label && (
        <InputLabel
          {...labelProps}
          shrink={true}
          className={cx(classes.label, labelProps?.className)}
        >
          {renderNode(label)}
          {loading && <CircularProgress size={14} className={classes.loading} />}
        </InputLabel>
      )}
      </Box>
      {children}
      {helperText && (
        <FormHelperText {...helperTextProps}>
          {renderNode(helperText)}
        </FormHelperText>
      )}
      {suffix}
    </FormControl>
  );
};

export default withThemeNext(React.forwardRef(FormField));
