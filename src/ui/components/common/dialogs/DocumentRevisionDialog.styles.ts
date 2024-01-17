import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  root: {
    pointerEvents: 'none',
  },
  title: {
    display: 'flex',
  },
  paper: {
    pointerEvents: 'auto',
    width: '80%',
    maxWidth: '80%',
    minHeight: '80vh',
  },
  heading: {
    fontWeight: 600,
    fontSize: 14,
    flex: 1,
    color: Colors.almost_black,
  },
  close: {
    height: 24,
    width: 24,
    backgroundColor: Colors.athens_gray,
    borderRadius: 6,
    margin: theme.spacing(0, 1.25),
  },
}));
