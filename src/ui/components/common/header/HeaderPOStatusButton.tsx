
import { Button, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    "margin": 0,
    "&:hover": {
      backgroundColor: "unset",
    },
  },
  label: {
    padding: "10px 15px 10px 12px",
    fontFamily: "Sora",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "15px",
    backgroundColor: Colors.white,
    color: Colors.almost_black,
    borderRadius: "4px",
  },
});

export const StyledPOStatusButton = withStyles(styles)(Button);
