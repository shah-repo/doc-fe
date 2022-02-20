import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 109px)",
  },
  exportBtn: {
    margin: 0,
    boxShadow: "none",
    borderRadius: 100,
    marginRight: theme.spacing(0.625),
    textTransform: "none",
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    fontFamily: "Sora",
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
    "fontFamily": "Sora",
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
    "fontFamily": "Sora",
    "paddingRight": theme.spacing(2.5),
    "paddingLeft": theme.spacing(2.5),
    "textTransform": "none",
    "&:hover": {
      background: Colors.navy,
    },
  },
  clearButton: {
    margin: theme.spacing(0, 2, 0, 0),
    backgroundColor: Colors.white,
    borderRadius: "200px", // TODO: Move in specific file for border radius
    textTransform: "none",
    fontFamily: "Sora",
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: `1px solid ${Colors.navy}`,
    letterSpacing: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: 24,
    color: Colors.almost_black,
    textTransform: "capitalize",
    fontFamily: "Sora",
  },
}
));
export default KendoGridStyles;
