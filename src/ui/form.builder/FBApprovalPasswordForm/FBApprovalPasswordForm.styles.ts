import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    labelContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(2.5),
    },
    label: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.textBlack,
      lineHeight: '15px',
      marginBottom: theme.spacing(1.25),
    },
  }));
