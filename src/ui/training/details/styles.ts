import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      marginBottom: theme.spacing(4),
    },
    label: {
      fontSize: '1rem',
      color: '#737674',
      fontWeight: 'bold',
      letterSpacing: '1px',
      marginBottom: theme.spacing(1),
    },
    itemContentBlue: {
      fontSize: '1rem',
      color: Colors.blue,
      fontWeight: 700,
    },
    dialogContent: {
      padding: '25px',
    },
    dialogTitle: {
      fontSize: '1.5rem',
      color: Colors.black,
      fontWeight: 500,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);
