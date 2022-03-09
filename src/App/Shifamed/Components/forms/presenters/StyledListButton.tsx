
import { Button, withStyles } from "@material-ui/core";
import Colors from "../../../../../ui/layout/theme/utils/colors";

const styles = () => ({
  root: {
    margin: "0px",
  },
  label: {
    padding: "10.5px 20px",
    fontFamily: "Sora",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "15px",
    backgroundColor: Colors.white,
    color: Colors.navy,
    borderRadius: "6px",
  },
});

export const StyledButton = withStyles(styles)(Button);
