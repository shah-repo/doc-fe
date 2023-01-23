
import { Button, withStyles } from "@material-ui/core";
import Colors from "../../../../../ui/layout/theme/utils/colors";

const styles = () => ({
  root: {
    "margin": 0,
    "&:hover": {
      backgroundColor: "unset",
    },
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
    borderRadius: "100px",
    minWidth: "72px",
  },
});

export const StyledButton = withStyles(styles)(Button);
