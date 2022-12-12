import { withStyles } from "@material-ui/core/styles";
import Colors from "../../layout/theme/utils/colors";
import FBButton from "./FBButton";

const styles = () => ({
  root: {
    "height": "36px",
    "borderRadius": "100px",
    "background": Colors.sky_blue,
    "color": Colors.navy,
    "border": `1px solid ${Colors.sky_blue}`,
    "boxShadow": "none",
    "&:hover": {
      background: Colors.sky_blue,
      border: `1px solid ${Colors.sky_blue}`,
    },
  },
});
export const StyledCancelFBButton = withStyles(styles)(FBButton);
