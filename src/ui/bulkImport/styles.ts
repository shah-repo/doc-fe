import { makeStyles } from '@material-ui/core';
import { Colors } from '../layout/theme-next';

export const importLogDown = 1620;

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 3, 12.5, 3),
    overflow: 'auto',
    maxHeight: '100vh',
  },
  importContainer: {
    display: 'flex',
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down(importLogDown)]: {
      display: 'block',
      marginBottom: theme.spacing(6.25),
    },
  },
  loadingContainer: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgb(0 0 0 / 34%)',
    zIndex: 10,
  },
  loading: {
    margin: 'auto',
  },
  headerContainer: {
    position: 'relative',
  },
  backToDashboard: {
    position: 'absolute',
    top: theme.spacing(2.5),
    left: theme.spacing(1),
    '& a': {
      paddingLeft: 0,
    },
  },
  [theme.breakpoints.down('md')]: {
    backToDashboard: {
      display: 'none',
    },
  },
  arrowLeftIcon: {
    width: 15,
    height: 15,
    color: Colors.primary,
    marginRight: theme.spacing(1.2),
  },
  jobIdText: {
    color: Colors.textDisabled,
    marginLeft: theme.spacing(0.625),
    alignContent: 'center',
    height: 16.5,
  },
  backToDashBoardButtonText: {
    display: 'flex',
  },
  buttonLabel: {
    [theme.breakpoints.down(1570)]: {
      flexDirection: 'column',
    },
  },
}));
