import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  kGrid: {
    width: "calc(100vw - 255px)",
    height: "calc(100vh - 110px)",
    margin: theme.spacing(0.625),
  },
  exportBtn: {
    margin: 0,
    boxShadow: "none",
    borderRadius: 100,
    marginRight: theme.spacing(1.875),
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
    "marginRight": theme.spacing(1.25),
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
    "marginRight": theme.spacing(1.25),
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
    marginLeft: theme.spacing(0.625),
    boxShadow: "none",
    borderRadius: 100,
    marginRight: theme.spacing(1.875),
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
  title: {
    fontWeight: 700,
    fontSize: 14,
    color: Colors.almost_black,
    textTransform: "uppercase",
    fontFamily: "Sora",
    marginTop: theme.spacing(1.25),
    marginLeft: theme.spacing(0.625),
  },
}
));
export default KendoGridStyles;
