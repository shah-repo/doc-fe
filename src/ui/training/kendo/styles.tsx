import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
    height: "66px",
    alignContent: "center",
  },
  kGridRoot: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 135px)",
  },
  exportListbutton: {
    margin: 0,
    boxShadow: "none",
    borderRadius: 100,
    marginRight: theme.spacing(1.875),
    textTransform: "capitalize",
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
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
    height: theme.spacing(1.75),
    width: theme.spacing(1.75),
  },
  dialogContent: {
    padding: theme.spacing(3.125),
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    color: Colors.almost_black,
    textTransform: "capitalize",
    fontFamily: "Sora",
  },
  gridClass: {
    textAlign: "right",
  },
  leftAlign: {
    textAlign: "left",
  },
  rightAlign: {
    textAlign: "right",
  },
  errorClass: {
    color: Colors.red,
  },
}));
export default KendoGridStyles;
