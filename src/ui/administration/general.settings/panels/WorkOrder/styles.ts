import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: 0,
      padding: 0,
      justifyContent: 'space-between',
      gap: theme.spacing(1.25, 1.25),
    },
    radio: {
      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '&$checked': {
        color: Colors.primary,
        '&:hover': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    list: {
      margin: 0,
    },
    checked: {},
    radioLabel: {
      fontWeight: 400,
      fontSize: 14,
    },
  }),
);
