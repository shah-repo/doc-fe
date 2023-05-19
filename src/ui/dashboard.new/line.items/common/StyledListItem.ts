import { ListItem, withStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

const styles = () => ({
  root: {
    '&:hover': {
      backgroundColor: Colors.sky_blue,
    },
  },
});

export const StyledListItem = withStyles(styles)(ListItem);
