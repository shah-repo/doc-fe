import { ListItem, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  root: { "backgroundColor": Colors.white, "&:hover": {} },
});

export const StyledListItem = withStyles(styles)(ListItem);
