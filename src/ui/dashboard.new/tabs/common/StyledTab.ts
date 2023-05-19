import { Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Colors from '../../../layout/theme/utils/colors';

const styles = () => ({
  root: {
    'text-transform': 'capitalize',
    'minWidth': '125px',
    'color': Colors.font_gray,
    'font-weight': 'normal',
    'fontSize': '18px',
    'lineHeight': '23px',
    /* identical to box height */
    'display': 'flex',
    'alignItems': 'center',
    'letterSpacing': '0.25px',
    'padding-right': 0,
    'padding-left': 0,
    'margin-right': 12,
    'margin-left': 12,
  },
  selected: {
    opacity: 1,
    color: Colors.black,
    fontWeight: 600,
  },
});

export default withStyles(styles)(Tab);
