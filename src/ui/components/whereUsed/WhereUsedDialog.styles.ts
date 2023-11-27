import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    pointerEvents: 'auto',
    width: '80%',
    maxWidth: '80%',
    minHeight: '80vh',
  },
  close: {
    height: 24,
    width: 24,
    backgroundColor: Colors.athens_gray,
    borderRadius: theme.spacing(0.75),
    margin: theme.spacing(0, 1.25),
  },
  content: {
    padding: 0,
  },
  actions: {
    padding: 0,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 700,
    fontSize: 14,
    flex: 1,
    color: Colors.almost_black,
  },
  title: {
    display: 'flex',
  },
}));
