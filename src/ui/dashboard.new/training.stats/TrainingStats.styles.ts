import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  chart: {
    minHeight: 240,
  },
}));
