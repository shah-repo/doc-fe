import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  icon: {
    height: 17,
    width: 17,
  },
  star: {
    color: Colors.statusDraft,
    height: 9,
    width: 11,
    top: 8,
    position: 'absolute',
  },
  iconContainer: {
    padding: theme.spacing(0.43),
    cursor: 'pointer',
  },
}));
