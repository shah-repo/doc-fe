import { createStyles, makeStyles } from '@material-ui/core';
import { NextTheme } from '../../layout/theme-next/provider';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: NextTheme) =>
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
      color: Colors.dark_gray,
    },
    [theme.media.mobile]: {
      passwordSuccessfulInfo: {
        width: '100%',
      },
      logo: {
        margin: theme.spacing(4),
      },
      submit: {
        width: '80%',
      },
    },
  }),
);
