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
    maxWidth: "300px",
  },
  tooltipPlacementTop: {
    margin: "8px 0",
  },
});

export const StyleTooltip = withStyles(styles)(Tooltip);
