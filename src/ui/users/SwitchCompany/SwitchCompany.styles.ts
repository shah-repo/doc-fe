import { createStyles, makeStyles, Theme } from '@material-ui/core';

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
  }),
);
