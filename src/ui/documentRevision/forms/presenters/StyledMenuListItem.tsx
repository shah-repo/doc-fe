import { ListItem, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    "color": Colors.white,
    "backgroundColor": Colors.white,
    "&:hover": {
      backgroundColor: Colors.white,
      color: Colors.white,
    },
  },
});

export const StyledMenuListItem = withStyles(styles)(ListItem);
