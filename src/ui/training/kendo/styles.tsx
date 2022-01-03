import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme) => ({
  root: {
    padding: "0 5px 10px 5px",
  },
  kGrid: {
    height: "calc(100vh - 99px)",
  },
  exportListbutton: {
    margin: "0px",
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
  iconSvg: {
    fill: Colors.navy,
    marginRight: 5,
  },
  dialogContent: {
    padding: "25px",
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
}));
export default KendoGridStyles;
