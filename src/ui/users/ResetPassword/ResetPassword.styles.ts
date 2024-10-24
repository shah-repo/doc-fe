import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';
import { REDIRECT_DELAY } from './ResetPasswordSuccessful';

export default makeStyles<NextTheme>(theme => createStyles({
  root: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: theme.spacing(0, 4),
  },
  header: {
    padding: theme.spacing(8, 0, 2.5),

    [theme.media.mobile]: {
      padding: theme.spacing(2.5, 0),
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  logo: {
    display: 'block',
    margin: '0 auto',
    transform: 'translate(-20%, 0)',
  },
  formTitle: {
    textAlign: 'center',
    margin: theme.spacing(2.5, 0, 6.25),
  },
  title: {
    fontWeight: 'bold',
    color: Colors.textBlack,
    fontSize: 31,
    margin: 0,
    padding: 0,
  },
  subtitle: {
    color: Colors.textGray,
    fontSize: 12,
    marginTop: theme.spacing(0.5),
    padding: 0,
    fontWeight: 400,
  },
  info: {
    color: Colors.textGray,
    fontSize: 16,
    lineHeight: 1.2,
    fontWeight: 400,
    marginTop: theme.spacing(1),
  },
  form: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4.25, 3),
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  field: {
    fontSize: 16,
    padding: theme.spacing(2.25, 2),
  },
  helper: {
    position: 'absolute',
    top: '100%',
  },
  submitButton: {
    width: '100%',
    padding: theme.spacing(2.5),
    margin: theme.spacing(2, 0),
    fontSize: 14,
    fontWeight: 500,
  },
  '@keyframes redirectAnimation': {
    '0%': {
      transform: 'translate(-100%, 0)',
    },
    '100%': {
      transform: 'translate(0, 0)',
    },
  },
  redirectButton: {
    position: 'relative',
    overflow: 'hidden',

    '&:before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: Colors.primaryDark,
      animation: `$redirectAnimation ${REDIRECT_DELAY}ms ${theme.transitions.easing.easeOut}`,
    },
    '& span': {
      position: 'relative',
    },
  },
  actions: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none',
    color: Colors.primary,
    fontSize: 16,
  },
}));
