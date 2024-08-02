import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 3, 12.5, 3),
    overflow: 'auto',
    maxHeight: '100vh',
  },
  importContainer: {
    display: 'flex',
    padding: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: {
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
  backToDashboard: {
    position: 'absolute',
    top: 44,
    left: 30,
  },
  [theme.breakpoints.down('md')]: {
    backToDashboard: {
      display: 'none',
    },
  },
}));
