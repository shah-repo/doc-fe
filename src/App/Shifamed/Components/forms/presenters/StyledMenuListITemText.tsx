import { ListItemText, withStyles } from '@material-ui/core';
import Colors from '../../../../../ui/layout/theme/utils/colors';

const styles = () => ({
  primary: {
    fontFamily: 'Sora',
    fontSize: '14px',
    color: Colors.dark_jungle_green,
  },
});

export const StyledMenuListItemText = withStyles(styles)(ListItemText);
