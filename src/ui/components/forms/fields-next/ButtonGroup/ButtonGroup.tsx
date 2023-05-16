import { ButtonGroup as MuiButtonGroup } from '@material-ui/core';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import { useButtonType } from '../Button/Button.utils';
import { ButtonGroupProps } from './ButtonGroup.types';

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  kind = 'primary',
  variant,
  color,
  ...props
}) => {
  const [muiVariant, muiColor] = useButtonType(kind);

  return (
    <MuiButtonGroup {...props} variant={variant ?? muiVariant} color={color ?? muiColor}>
      {children}
    </MuiButtonGroup>
  );
};

export default withThemeNext(ButtonGroup);
