import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    backgroundColor: Colors.latest_green_varient,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: Colors.white,
  },
});

export const HoverStyleChip = withStyles(styles)(Chip);
