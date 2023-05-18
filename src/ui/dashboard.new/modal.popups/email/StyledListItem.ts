import { ListItem, withStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

const styles = () => ({
  root: {
    'backgroundColor': Colors.white,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

export const StyledListItem = withStyles(styles)(ListItem);
