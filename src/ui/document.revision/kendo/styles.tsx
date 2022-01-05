import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme) => ({
  root: {
    padding: "0 5px 10px 5px",
  },
  kGrid: {
    height: "calc(100vh - 99px)",
  },
  icon: {
    width: "25px",
    height: "25px",
    marginRight: 4,
    fontFamily: "Sora",
    fontSize: 12,
    fontWeight: 600,
    color: Colors.white,
    backgroundColor: Colors.grey_cloud,
  },
  exportListbutton: {
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
  createDocButton: {
    "margin": 0,
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
  iconSvg: {
    fill: Colors.navy,
    marginRight: 5,
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
