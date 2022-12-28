
import { Button, Theme, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const styles = (theme: Theme) => ({
  root: {
    "margin": 0,
    "&:hover": {
      backgroundColor: "unset",
    },
  },
  label: {
    padding: theme.spacing(1.25, 1.875, 1.25, 1.5),
    fontFamily: "Sora",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "15px",
    backgroundColor: Colors.white,
    color: Colors.almost_black,
    borderRadius: 4,
  },
});

export const StyledPOStatusButton = withStyles(styles)(Button);
