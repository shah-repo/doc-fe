import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.white,
    },
    paper: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      width: '500px',
    },
    logo: {
      margin: '10px 0 100px 0',
    },
    title: {
      fontWeight: 'bold',
      color: Colors.black,
      fontSize: '2rem',
    },
    subtitle: {
      color: Colors.dark_gray,
    },
    status: {
      marginTop: theme.spacing(3),
    },
    submit: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginLeft: 0,
      width: 'inherit',
      borderRadius: '50px',
      height: '50px',
    },
    formStyle: {
      width: '500px',

    },
  }),
);
