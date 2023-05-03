import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: 560,
    },
    contenttitle: {
      position: 'static',
      paddingTop: 29,
      marginLeft: theme.spacing(4.375),
      fontSize: 12,
      fontWeight: 600,
      color: Colors.textBlack,
    },
    radio: {
      paddingTop: 11,
      marginLeft: theme.spacing(4.375),
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
    radioLabel: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1,
      color: Colors.textBlack,
    },
  }),
);
