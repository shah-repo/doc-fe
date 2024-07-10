import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';
import { FieldStyleProps } from './Field';

export const styles = makeStyles((theme) => ({
  typography: ({ error }: FieldStyleProps) => ({
    color: error ? theme.palette.primary.main : theme.typography.h4.color,
  }),
  form: ({ gutter }: FieldStyleProps) => ({
    margin: gutter ? theme.spacing(0, 0, 2.5) : theme.spacing(1, 0, 1),
  }),
  formInputLabel: {
    position: 'relative',
    marginTop: -14, // as we add 14 for the label we remove 14 here to have the same position
    '& label': {
      zIndex: 1,
      fontSize: 12,
      color: Colors.textDisabled,
    },
    '& .MuiInputLabel-formControl': {
      transform: 'translate(8px, 26px) scale(1)',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0, 1.5px) scale(0.9)',
    },
    '& .MuiOutlinedInput-root': {
      marginTop: 14,
    },
  },
}));
