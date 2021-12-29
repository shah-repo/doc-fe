import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme) => ({
  cRoot: {
    width: "99%",
    margin: "5px",
  },
  root: {
    textAlign: "right",
    marginLeft: "5px",
    fontFamily: "Sora",
  },
  kGrid: {
    width: "calc(100vw - 263px)",
    height: "calc(100vh - 75px)",
  },
  loading: {
    top: 0,
  },
  groupCell: {
    whiteSpace: "pre-wrap",
  },
  link: {
    fontSize: "14px",
    fontFamily: "Sora",
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
