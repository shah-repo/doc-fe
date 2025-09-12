import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5, 0.5),
    color: Colors.error,
    fontWeight: 600,
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
}));
