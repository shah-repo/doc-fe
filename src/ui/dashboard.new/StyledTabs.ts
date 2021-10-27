import { Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Colors from "../layout/theme/utils/colors";

const styles = () => ({
  indicator: {
    "display": "flex",
    "justifyContent": "center",
    "backgroundColor": "transparent",
    "& > span": {
      width: "100%",
      backgroundColor: Colors.white,
    },
  },
});

export const StyledTabs = withStyles(styles)(Tabs);
