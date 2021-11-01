import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    backgroundColor: Colors.white,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: Colors.font_gray,
  },
});

export const NormalStyleChip = withStyles(styles)(Chip);
