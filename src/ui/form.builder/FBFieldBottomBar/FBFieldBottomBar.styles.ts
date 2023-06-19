import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 5,
  },
  button: {
    width: 320,
    borderBottomRightRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    backgroundColor: Colors.primaryLight,
  },
}));
