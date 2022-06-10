import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) => ({
  exportBtn: {
    margin: 0,
    boxShadow: "none",
    borderRadius: 100,
    marginRight: theme.spacing(0.625),
    textTransform: "none",
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: `1px solid ${Colors.navy}`,
    backgroundColor: Colors.white,
  },
  addBtn: {
    "marginTop": 0,
    "marginBottom": 0,
    "boxShadow": "none",
    "borderRadius": 100,
    "background": Colors.navy,
    "color": Colors.white,
    "paddingRight": theme.spacing(2.5),
    "paddingLeft": theme.spacing(2.5),
    "textTransform": "none",
    "&:hover": {
      background: Colors.navy,
    },
  },
  disabledAddBtn: {
    "marginTop": 0,
    "marginBottom": 0,
    "boxShadow": "none",
    "borderRadius": 100,
    "background": Colors.white,
    "color": Colors.black,
    "paddingRight": theme.spacing(2.5),
    "paddingLeft": theme.spacing(2.5),
    "textTransform": "none",
    "&:hover": {
      background: Colors.navy,
    },
  },
  clearButton: {
    marginLeft: theme.spacing(0.625),
    boxShadow: "none",
    borderRadius: 100,
    marginRight: theme.spacing(1.875),
    textTransform: "none",
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: `1px solid ${Colors.navy}`,
    backgroundColor: Colors.white,
    letterSpacing: 0,
  },
}
));
