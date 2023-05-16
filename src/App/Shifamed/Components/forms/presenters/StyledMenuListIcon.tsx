import { ListItemIcon, withStyles } from '@material-ui/core';

const styles = () => ({
  root: {
    minWidth: '30px',
  },
  alignItemsFlexStart: {
    marginTop: '4px',
  },
});

export const StyledMenuListIcon = withStyles(styles)(ListItemIcon);
