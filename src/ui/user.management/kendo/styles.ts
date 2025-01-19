import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(0, 3.75, 2),
  },
  actions: {
    padding: theme.spacing(0.75, 0),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1, 1),
  },
  table: {
    flexGrow: 1,
    margin: theme.spacing(2, 0, 0),
  },
}));
