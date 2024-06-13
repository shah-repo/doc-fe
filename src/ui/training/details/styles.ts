import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      marginBottom: theme.spacing(3),
    },
    label: {
      fontSize: '0.8rem',
      fontWeight: 'bold',
      marginBottom: theme.spacing(0.5),
      color: Colors.black,
    },
    itemContentBlue: {
      color: Colors.navy,
    },
    itemContentBlack: {
      fontWeight: 'bold',
    },
    dialogContent: {
      padding: '25px',
    },
    dialogTitle: {
      fontSize: '1.5rem',
      color: Colors.black,
      fontWeight: 500,
    },
    titleIcon: {
      fontSize: '1.7rem',
      color: Colors.blue,
      marginRight: theme.spacing(1.5),
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
    rightContainer: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      color: Colors.black,
      backgroundColor: Colors.light_blue2,
      marginBottom: theme.spacing(3),
    },
    refID: {
      textDecoration: 'none',
    },
  }),
);
