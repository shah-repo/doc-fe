import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles((theme) => ({
  icon: {
    height: 17,
    width: 17,
  },
  iconContainer: {
    padding: theme.spacing(0.43),
    cursor: 'pointer',
  },
  dot: {
    height: 10,
    width: 10,
  },
  selectedDot: {
    color: Colors.textBlack,
  },
  deselectedDot: {
    color: Colors.textGray,
  },
}));
