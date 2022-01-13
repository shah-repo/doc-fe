import { Tooltip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  arrow: {
    color: Colors.black,
  },
  tooltip: {
    backgroundColor: Colors.black,
  },
  tooltipPlacementTop: {
    margin: "8px 0",
  },
});

export const StyledTooltip = withStyles(styles)(Tooltip);
