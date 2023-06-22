import { InputBase, TextareaAutosize } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './TextField.styles';
import { TextFieldProps } from './TextField.types';

const TextField: React.FC<TextFieldProps> = React.forwardRef(({
  size = 'medium',
  autosize,
  classes,
  endAdornment,
  startAdornment,
  ...props
}, ref) => {
  const customClasses = useStyles();

  return (
    <InputBase
      {...props}
      inputComponent={autosize ? TextareaAutosize : undefined}
      startAdornment={startAdornment}
      endAdornment={endAdornment}
      classes={{
        ...classes,
        input: cx(
          classes?.input,
          {
            [customClasses.inputSmall]: size === 'small',
            [customClasses.withStartAdornment]: startAdornment,
            [customClasses.withEndAdornment]: endAdornment,
          },
        ),
      }}
      ref={ref}
    />
  );
});

export default withThemeNext(TextField);
