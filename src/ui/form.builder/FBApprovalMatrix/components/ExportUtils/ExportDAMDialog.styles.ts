import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      background: Colors.medium_blue,
      color: Colors.white,
      boxShadow: 'none',
      margin: theme.spacing(0, 2, 0, 1),
      flexGrow: 1,
      '&:hover': {
        background: Colors.medium_blue,
      },
    },
    cancelButton: {
      background: Colors.light_blue,
      color: Colors.medium_blue,
      boxShadow: 'none',
      margin: theme.spacing(0, 1, 0, 2),
      flexGrow: 0.6,
      '&:hover': {
        background: Colors.light_blue,
      },
    },
    dialogAction: {
      display: 'flex',
      marginBottom: 10,
    },
    subtitle: {
      marginTop: 20,
      marginBottom: 5,
      textAlign: 'start',
    },
  }),
);
