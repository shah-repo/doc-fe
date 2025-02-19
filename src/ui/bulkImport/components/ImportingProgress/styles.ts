import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  container: {
    display: 'block',
    margin: 'auto',
    maxWidth: 500,
    textAlign: 'center',
  },
  loading: {
    marginTop: theme.spacing(3.125),
  },
}));
