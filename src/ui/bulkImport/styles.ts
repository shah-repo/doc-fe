import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 3, 0),
    overflow: 'auto',
    maxHeight: '100vh',
    paddingBottom: 100,
  },
  importContainer: {
    display: 'flex',
    padding: 20,
    [theme.breakpoints.down('md')]: {
      display: 'block',
      marginBottom: 50,
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
}));
