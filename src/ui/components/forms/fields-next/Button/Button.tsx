import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button as MuiButton } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './Button.styles';
import { ButtonProps } from './Button.types';
import { useButtonType } from './Button.utils';

const Button: React.FC<ButtonProps> = React.forwardRef(({
  children,
  kind = 'primary',
  className,
  attached,
  variant,
  color,
  startIcon,
  ...props
}, ref) => {
  const [muiVariant, muiColor] = useButtonType<ButtonProps['kind']>(
    kind,
    { add: ['outlined', 'secondary'] },
  );
  const classes = useStyles();
  const muiStartIcon = kind === 'add' && !startIcon ? <FontAwesomeIcon icon={solid('plus')} /> : startIcon;

  return (
    <MuiButton
      {...props}
      ref={ref}
      variant={variant ?? muiVariant}
      color={color ?? muiColor}
      startIcon={muiStartIcon}
      className={cx(className, { [classes.attached]: attached })}
    >
      {children}
    </MuiButton>
  );
});

export default withThemeNext(Button);
