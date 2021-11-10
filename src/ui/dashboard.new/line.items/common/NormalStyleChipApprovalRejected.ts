import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    backgroundColor: Colors.white,
    borderRadius: "3px",
    fontFamily: "Sora",
    fontStyle: "normal",
    "font-weight": "bold",
    fontSize: "12px",
    lineHeight: "15px",
  },
  colorPrimary: {
    color: Colors.latest_red_varient,
  },
});

export const NormalStyleChip = withStyles(styles)(Chip);
