import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

const Commandstyles = makeStyles(() => ({
  button: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  ButtonColor: {
    color: Colors.navy,
  },
  Cancel: {
    color: Colors.latest_yellow_varient,
  },
}));

export default Commandstyles;
