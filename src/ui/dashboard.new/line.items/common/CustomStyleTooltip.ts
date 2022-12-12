import { Tooltip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  arrow: {
    color: Colors.latest_red_varient,
  },
  tooltip: {
    backgroundColor: Colors.latest_red_varient,
    fontSize: "12px",
    fontWeight: 400,
  },
  tooltipPlacementTop: {
    margin: "8px 0",
  },
  // Need this because of material ui bug with tooltip zIndex
  // Tooltip displays over every other element on top of it
  popper: {
    zIndex: 1,
  },
});

export const CustomStyleTooltip = withStyles(styles)(Tooltip);
