import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme) => ({
  kGrid: {
    width: "calc(100vw - 255px)",
    height: "calc(100vh - 110px)",
    margin: "5px",
  },
  exportBtn: {
    margin: 0,
    boxShadow: "none",
    borderRadius: 100,
    marginRight: 15,
    textTransform: "none",
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "Sora",
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: `1px solid ${Colors.navy}`,
    backgroundColor: Colors.white,
  },
  addBtn: {
    "marginRight": "10px",
    "boxShadow": "none",
    "borderRadius": 100,
    "background": Colors.navy,
    "color": Colors.white,
    "fontFamily": "Sora",
    "paddingRight": 20,
    "paddingLeft": 20,
    "textTransform": "none",
    "&:hover": {
      background: Colors.navy,
    },
  },
  disabledAddBtn: {
    "marginRight": "10px",
    "boxShadow": "none",
    "borderRadius": 100,
    "background": Colors.white,
    "color": Colors.black,
    "fontFamily": "Sora",
    "paddingRight": 20,
    "paddingLeft": 20,
    "textTransform": "none",
    "&:hover": {
      background: Colors.navy,
    },
  },
  clearButton: {
    marginLeft: "5px",
    boxShadow: "none",
    borderRadius: 100,
    marginRight: 15,
    textTransform: "none",
    paddingRight: 20,
    paddingLeft: 20,
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
    marginTop: 10,
    marginLeft: 5,
  },
}
));
export default KendoGridStyles;
