import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      marginBottom: theme.spacing(3),
    },
    label: {
      fontSize: '1rem',
      fontWeight: 'bold',
      letterSpacing: '1px',
      marginBottom: theme.spacing(0.5),
    },
    itemContentBlue: {
      fontSize: '1rem',
      color: Colors.navy,
    },
    itemContentBlack: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    dialogContent: {
      padding: '25px',
    },
    dialogTitle: {
      fontSize: '1.5rem',
      color: Colors.black,
      fontWeight: 500,
      marginLeft: theme.spacing(1),
    },
    detailsDialogContent: {
      marginLeft: theme.spacing(6),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    titleIcon: {
      fontSize: '2rem',
      display: 'flex',
      alignItems: 'center',
      color: Colors.blue,
    },
    rightContainer: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1.2),
      backgroundColor: Colors.light_blue,
    },
  }),
);
