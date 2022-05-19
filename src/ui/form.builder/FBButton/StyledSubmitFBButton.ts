
import { withStyles } from "@material-ui/core/styles";
import { FBButton } from "..";
import Colors from "../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    "height": "36px",
    "borderRadius": "100px",
    "background": Colors.navy,
    "color": Colors.white,
    "border": `1px solid ${Colors.navy}`,
    "boxShadow": "none",
    "&:hover": {
      background: Colors.navy,
    },
    "&.Mui-disabled": {
      border: "none",
      backgroundColor: Colors.gains_boro,
      color: Colors.spanish_gray,
    },
  },
});

export const StyledSubmitFBButton = withStyles(styles)(FBButton);
