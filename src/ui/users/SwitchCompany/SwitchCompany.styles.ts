import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme-next/colors';
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
      width: 'auto',
      height: 'max-content',
      backgroundColor: theme.palette.common.white,
    },
    container: {
      width: '500px',
      marginTop: '40px',
    },
    title: {
      fontSize: '26px',
    },
    subtitle: {
      marginBottom: '40px',
      fontSize: '16px',
      fontWeight: 300,
    },
    avatar: {
      width: '58px',
      height: '58px',
      borderRadius: '50%',
      border: '1px solid lightgrey',
    },
    companyButton: {
      background: 'none',
      color: 'inherit',
      border: 'none',
      padding: 0,
      font: 'inherit',
      cursor: 'pointer',
      outline: 'inherit',
      fontSize: '18px',
      width: '480px',
      height: '100px',
      textAlign: 'justify',
      borderBottom: '1px solid lightgrey',
    },
    company: {
      display: 'flex',
    },
    companyName: {
      margin: '18px 0 18px 16px',
    },
    switchclosemobile: {
      display: 'none',
    },
    [theme.media.mobile]: {
      container: {
        width: '100%',
        padding: theme.spacing(3),
        marginTop: theme.spacing(0.24),
      },
      title: {
        textAlign: 'center',
      },
      subtitle: {
        textAlign: 'center',
      },
      companyButton: {
        width: '100%',
      },
      switchclosemobile: {
        width: 30,
        height: 30,
        top: theme.spacing(1.3),
        padding: theme.spacing(1),
        borderRadius: 4,
        backgroundColor: Colors.hover,
        marginLeft: '90%',
        display: 'unset',
      },
      selectedIcon: {
        color: '#4D88FF',
        width: 11,
        height: 17,
        fontSize: 18,
        fontWeight: 900,
        lineHeight: 16.8,
        marginLeft: '25%',
        marginBottom: '8%',
        marginTop: '-17px',
      },
    },
  }),
);
