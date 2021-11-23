import { Tabs, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    top: "33px",
    flexGrow: 1,
    border: `1px solid ${Colors.navy}`,
  },
});

export const StyledTabs = withStyles(styles)(Tabs);
