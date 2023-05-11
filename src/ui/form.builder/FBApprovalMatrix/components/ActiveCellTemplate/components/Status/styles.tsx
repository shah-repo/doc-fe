import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../layout/theme-next';

export default makeStyles(() => ({
  status: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 5,
  },
  circle: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: Colors.statusClosed,
    marginRight: 6,
  },
  circleActive: {
    backgroundColor: Colors.success,
  },
}));
