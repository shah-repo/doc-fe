import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  actions: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25),
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: '100%',
  },
  deleteIcon: {
    color: Colors.error,
  },
}));
