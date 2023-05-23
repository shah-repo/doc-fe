import { InputBase, InputBaseProps } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './TextField.styles';

interface TextFieldProps extends InputBaseProps {
  size?: 'small' | 'medium'
}

const TextField: React.FC<TextFieldProps> = React.forwardRef(({ size = 'medium', classes, ...props }, ref) => {
  const customClasses = useStyles();

  return (
    <InputBase
      {...props}
      classes={{
        ...classes,
        input: cx(classes?.input, { [customClasses.inputSmall]: size === 'small' }),
      }}
      ref={ref}
    />
  );
});

export default withThemeNext(TextField);
