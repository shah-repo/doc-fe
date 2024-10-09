import { makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export const styles = makeStyles((theme: Theme) => ({
  groupCell: {
    whiteSpace: 'pre-wrap',
  },
  link: {
    fontSize: 14,
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 12,
    marginLeft: theme.spacing(0.5),
  },
  confirmedIcon: {
    color: Colors.success,
  },
  unconfirmedIcon: {
    color: Colors.warning,
  },
  lockedIcon: {
    color: Colors.error,
  },
}));
