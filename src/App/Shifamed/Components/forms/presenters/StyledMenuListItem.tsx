import { ListItem, withStyles } from '@material-ui/core';
import Colors from '../../../../../ui/layout/theme/utils/colors';

const styles = () => ({
  root: {
    'color': Colors.almost_black,
    'backgroundColor': Colors.white,
    '&:hover': {
      backgroundColor: Colors.titan_white,
      color: Colors.almost_black,
    },
  },
});

export const StyledMenuListItem = withStyles(styles)(ListItem);
