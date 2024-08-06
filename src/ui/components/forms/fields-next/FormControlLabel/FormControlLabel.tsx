import { FormControlLabel as MuiFormControlLabel, FormControlLabelProps } from '@material-ui/core';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';

const FormControlLabel: React.FC<FormControlLabelProps> = React.forwardRef((props, ref) => {
  return (
    <MuiFormControlLabel
      {...props}
      ref={ref}
    />
  );
});

export default withThemeNext(FormControlLabel);
