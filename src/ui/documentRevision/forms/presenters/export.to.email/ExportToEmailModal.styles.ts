import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: 560,
    },
    contenttitle: {
      position: 'static',
      marginLeft: theme.spacing(4.375),
      fontSize: 12,
      fontWeight: 600,
      color: Colors.textBlack,
    },
    radio: {
      paddingTop: 11,
      marginLeft: theme.spacing(5.625),
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
      margin: theme.spacing(1.375, 0, 0, 0.625),
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1,
      color: Colors.textBlack,
    },
  }),
);
