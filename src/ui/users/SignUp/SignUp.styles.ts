import { createStyles, makeStyles } from '@material-ui/core';
import { NextTheme } from '../../layout/theme-next/provider';

export const styles = makeStyles((theme: NextTheme) =>
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
      width: '500px',
      lineHeight: 1.5,
    },
    marginTitle: {
      marginBottom: '20px',
    },
    status: {
      marginTop: theme.spacing(3),
    },
    boldTitle: {
      width: '500px',
      lineHeight: 1.5,
      fontWeight: 'bold',
      marginBottom: '30px',
    },
    navigationLink: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      marginTop: '30px',
      fontWeight: 'bold',
    },
    submit: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginLeft: 0,
      marginRight: 0,
      width: 'inherit',
      borderRadius: '50px',
      height: '50px',
    },
    formStyle: {
      width: '500px',
      marginTop: '50px',
    },
    [theme.media.mobile]: {
      paper: {
        width: '100%',
        padding: theme.spacing(3),
      },
      boldTitle: {
        width: '100%',
        textAlign: 'center',
      },
      submit: {
        width: '100%',
      },
      marginTitle: {
        textAlign: 'center',
      },
      logo: {
        margin: theme.spacing(4),
      },
      title: {
        width: 'auto',
        textAlign: 'center',
      },
      verificationEmailMobile: {
        textAlign: 'center',
        overflowWrap: 'break-word',
      },
      formStyle: {
        width: 'auto',
      },
    },
  }),
);
