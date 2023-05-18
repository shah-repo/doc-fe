import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles(() => ({
  tooltip: {
    backgroundColor: Colors.almost_black,
    fontSize: 12,
    fontWeight: 400,
  },
  arrow: {
    color: Colors.almost_black,
  },
}));
