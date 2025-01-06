import { makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) => ({
  divider: {
    height: 30,
    marginRight: theme.spacing(1.5),
  },
  clear: {
    padding: 0,
    cursor: 'pointer',
  },
  confirm: {
    cursor: 'pointer',
  },
}));
