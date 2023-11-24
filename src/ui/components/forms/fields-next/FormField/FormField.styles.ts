import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  label: {
    alignItems: 'end',
    display: 'flex',
  },
  loading: {
    verticalAlign: '-.25em',
    margin: theme.spacing(0, 0, 0, 1),
  },
}));
