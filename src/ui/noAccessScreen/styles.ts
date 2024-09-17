import { makeStyles } from '@material-ui/core';
import { Colors } from '../layout/theme-next';
import { NextTheme } from '../layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
  },
  hero: {
    flexGrow: 1,
    width: '100%',
    position: 'relative',
    maxHeight: 400,
    margin: theme.spacing(0, 0, 4),

    [theme.breakpoints.down('xs')]: {
      flexGrow: 0,
      textAlign: 'center',
      margin: theme.spacing(0, 0, 2),
    },
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectPosition: 'center center',
    objectFit: 'contain',

    [theme.media.mobile]: {
      position: 'relative',
      width: '100%',
      height: 'auto',
    },
  },
  content: {
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: Colors.textBlack,
    margin: theme.spacing(0, 0, 1),

    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.media.mobile]: {
      fontSize: 18,
    },
  },
  body: {
    color: Colors.textGray,
    margin: theme.spacing(0, 0, 1),
    fontSize: 16,

    [theme.breakpoints.down('md')]: {
      fontSize: 14,
    },
  },
  cta: {
    textAlign: 'center',
    margin: theme.spacing(2.5, 0),
  },
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(1, 0, 0),
  },
}));
