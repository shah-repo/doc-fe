import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../ui/layout/theme-next';

export default makeStyles((theme) =>
  createStyles({
    submitButton: {
      background: Colors.primaryLight,
      color: Colors.white,
      boxShadow: 'none',
      margin: theme.spacing(0, 2, 0, 1),
      flexGrow: 1,
      '&:hover': {
        background: Colors.primaryLight,
      },
    },
    cancelButton: {
      background: Colors.primaryBg,
      color: Colors.primaryLight,
      boxShadow: 'none',
      margin: theme.spacing(0, 1, 0, 2),
      flexGrow: 0.6,
      '&:hover': {
        background: Colors.primaryBg,
      },
    },
    dialogAction: {
      display: 'flex',
      marginBottom: theme.spacing(1.25),
    },
    dialogContent: {
      color: Colors.textBlack,
      opacity: 0.6,
    },
    iconContainer: {
      '&:before': {
        content: "''",
        height: 40,
        width: 45,
        position: 'absolute',
        backgroundColor: Colors.gray,
        opacity: 0.1,
        transform: 'translate(-10px, -6px)',
        borderRadius: 11,
      },
    },
    title: {
      marginTop: theme.spacing(2.5),
      marginBottom: 5,
    },
    subtitle: {
      marginTop: theme.spacing(2.5),
      marginBottom: theme.spacing(0.625),
      textAlign: 'start',
    },
  }),
);
