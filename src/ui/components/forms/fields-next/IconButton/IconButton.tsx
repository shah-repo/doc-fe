import cx from 'classnames';
import React from 'react';
import { Button } from '..';
import { withThemeNext } from '../../../../layout/theme-next';
import { useButtonType } from '../Button/Button.utils';
import useStyles from './IconButton.styles';
import { IconButtonProps } from './IconButton.types';

const IconButton: React.FC<IconButtonProps> = React.forwardRef(({
  kind = 'primary',
  iconSize = 16,
  size = 'medium',
  variant,
  color,
  children,
  className,
  ...props
}, ref) => {
  const [muiVariant, muiColor] = useButtonType<IconButtonProps['kind']>(
    kind,
    {
      form: ['text', 'default'],
      simple: ['text', 'default'],
      action: ['contained', 'default'],
      destructive: ['text', 'default'],
    },
  );
  const classes = useStyles({ iconSize, size });
  const isSquare = kind && ['form', 'action', 'destructive'].includes(kind);
  const isBoxed = kind === 'action';
  const isSimple = kind === 'simple';
  const isDesctructive = kind === 'destructive';

  return (
    <Button
      {...props}
      ref={ref}
      variant={variant ?? muiVariant}
      color={color ?? muiColor}
      className={cx(
        classes.button,
        {
          [classes.square]: isSquare,
          [classes.simple]: isSimple,
          [classes.boxed]: isBoxed,
          [classes.destructive]: isDesctructive,
        },
        className,
      )}
    >
      {children}
    </Button>
  );
});

export default withThemeNext(IconButton);
