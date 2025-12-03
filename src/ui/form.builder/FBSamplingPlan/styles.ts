import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
  },
  aqlLevel: {
    minWidth: 120,
  },
}));
