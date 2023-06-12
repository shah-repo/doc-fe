import { Tooltip, withStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

const styles = () => ({
  arrow: {
    color: Colors.black,
  },
  tooltip: {
    backgroundColor: Colors.black,
    fontSize: '12px',
  },
  tooltipPlacementTop: {
    margin: '8px 0',
  },
  // Need this because of material ui bug with tooltip zIndex
  // Tooltip displays over every other element on top of it
  // this changes affect all applications tooltips so removed this
  popper: {
    zIndex: 1,
  //  display: "none",
  },
});

export const StyleTooltip = withStyles(styles)(Tooltip);
