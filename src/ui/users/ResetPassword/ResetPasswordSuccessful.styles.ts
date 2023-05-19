import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '10%',
      backgroundColor: theme.palette.common.white,
    },
    paper: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
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
    passwordSuccessfulInfo: {
      width: '500px',
      color: Colors.dark_gray,
    },
    submit: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginLeft: 0,
      width: '500px',
      borderRadius: '50px',
      height: '50px',
    },
    link: {
      fontSize: '1rem',
    },
    lockedInfo: {
      width: '700px',
      color: Colors.dark_gray,
    },
  }),
);
