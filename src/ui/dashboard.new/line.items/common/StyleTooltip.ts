import { Tooltip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  arrow: {
    color: Colors.black,
  },
  tooltip: {
    backgroundColor: Colors.black,
    fontFamily: "Sora",
    fontSize: "12px",
    zIndex: 1,
  },
  tooltipPlacementTop: {
    margin: "8px 0",
    zIndex: 1,
  },
  // Need this because of material ui bug with tooltip zIndex
  // Tooltip displays over every other element on top of it
  popper: {
    zIndex: 1,
  },
});

export const StyleTooltip = withStyles(styles)(Tooltip);
