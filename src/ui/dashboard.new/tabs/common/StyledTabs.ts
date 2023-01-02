import { Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  indicator: {
    "display": "flex",
    "justifyContent": "center",
    "backgroundColor": Colors.navy,
    "height": 3,
    "& > span": {
      width: "100%",
      backgroundColor: Colors.white,
    },
  },
});

export default withStyles(styles)(Tabs);
