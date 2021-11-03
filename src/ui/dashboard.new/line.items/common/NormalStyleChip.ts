import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    backgroundColor: Colors.white,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: (props) =>
      props.status ? Colors.latest_red_varient : Colors.latest_yellow_varient,
  },
});

export const NormalStyleChip = withStyles(styles)(Chip);
