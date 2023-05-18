import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

const commonButtonStyles = {
  'margin': 0,
  'boxShadow': 'none',
  'borderRadius': 100,
  'text-transform': 'capitalize',
};
const styles = makeStyles((theme) => ({
  createDocButton: {
    ...commonButtonStyles,
    'paddingLeft': theme.spacing(2.5),
    'paddingRight': theme.spacing(2.5),
    'marginLeft': theme.spacing(1.875),
    'background': Colors.navy,
    'color': Colors.white,
    '&:hover': {
      background: Colors.navy,
    },
  },
}
));
export default styles;
