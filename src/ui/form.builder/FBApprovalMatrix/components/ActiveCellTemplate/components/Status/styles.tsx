import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../layout/theme-next';

export default makeStyles((theme) => ({
  status: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(0.75),
  },
  circle: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: Colors.statusClosed,
    marginRight: theme.spacing(0.75),
  },
  circleActive: {
    backgroundColor: Colors.success,
  },
}));
