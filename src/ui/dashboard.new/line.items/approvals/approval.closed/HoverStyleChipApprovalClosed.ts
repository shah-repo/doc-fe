import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    backgroundColor: Colors.font_gray,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: Colors.white,
  },
});

export const HoverStyleChip = withStyles(styles)(Chip);
