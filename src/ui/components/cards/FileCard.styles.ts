import { Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

export const CardTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    fontSize: 16,
  },
}))(Tooltip);
