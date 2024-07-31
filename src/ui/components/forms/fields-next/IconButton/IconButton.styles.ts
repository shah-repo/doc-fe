import { ButtonProps, createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

const BUTTON_SIZES = {
  small: 30,
  medium: 36,
  large: 42,
};
const SQUARE_BUTTON_SIZES = {
  small: 25,
  medium: 30,
  large: 36,
};
const SQUARE_BUTTON_FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 18,
};

interface IconButtonStylesProps {
  iconSize: number
  size: ButtonProps['size']
  color: ButtonProps['color']
}

export default makeStyles((theme) => createStyles({
  button: ({ size = 'medium', iconSize }: IconButtonStylesProps) => ({
    width: BUTTON_SIZES[size],
    height: BUTTON_SIZES[size],
    minHeight: BUTTON_SIZES[size],
    fontSize: iconSize,
    padding: 0,
    minWidth: 0,
  }),
  square: ({ color, size = 'medium' }: IconButtonStylesProps) => ({
    width: SQUARE_BUTTON_SIZES[size],
    height: SQUARE_BUTTON_SIZES[size],
    minHeight: SQUARE_BUTTON_SIZES[size],
    fontSize: SQUARE_BUTTON_FONT_SIZES[size],
    borderRadius: theme.shape.borderRadius,
    color: color ? undefined : Colors.textGray,
    '&:hover': {
      color: color ? undefined : Colors.textBlack,
      background: Colors.hover,
    },
  }),
  boxed: () => ({
    background: Colors.darkGray,
    borderRadius: theme.shape.borderRadius,
  }),
  simple: ({ iconSize }: IconButtonStylesProps) => ({
    width: 'auto',
    height: 'auto',
    minHeight: 0,
    fontSize: iconSize,
    '& svg': {
      height: '1em',
    },
  }),
  destructive: () => ({
    color: Colors.error,
    '&:hover': {
      color: Colors.error,
      background: Colors.errorHighlight,
    },
  }),
}));
