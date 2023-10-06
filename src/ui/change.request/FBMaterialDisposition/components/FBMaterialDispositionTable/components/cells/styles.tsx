import { makeStyles } from '@material-ui/core';
import Colors from '../../../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  contentCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    width: 10,
  },
  selectedDot: {
    color: Colors.almost_black,
  },
  deselectedDot: {
    color: Colors.dark_gray2,
  },
}));
