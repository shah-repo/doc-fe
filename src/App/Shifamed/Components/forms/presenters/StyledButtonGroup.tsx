
import { ButtonGroup, withStyles } from "@material-ui/core";
import Colors from "../../../../../ui/layout/theme/utils/colors";

const styles = () => ({
  root: {
    "margin": 0,

    "& .MuiButtonGroup-grouped": {
      background: "transparent",
      margin: 0,
      color: Colors.navy,
    },
    "& .MuiButton-contained:hover": {
      boxShadow: "unset",

    },
  },
  contained: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "15px",
    backgroundColor: Colors.white,
    color: Colors.navy,
    borderRadius: "100px",
  },
});

export const StyledButtonGroup = withStyles(styles)(ButtonGroup);
