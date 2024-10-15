import { makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles((theme: Theme) => ({
  groupCell: {
    whiteSpace: 'pre-wrap',
  },
  link: {
    fontSize: 14,
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
  },
  statusIcon: {
    fontSize: 14,
  },
  confirmedIcon: {
    color: Colors.success,
  },
  unconfirmedIcon: {
    color: Colors.textDisabled,
  },
  lockedIcon: {
    color: Colors.error,
  },
}));
