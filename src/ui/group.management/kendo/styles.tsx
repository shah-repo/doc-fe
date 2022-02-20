import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "right",
    fontFamily: "Sora",
  },
  cRoot: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
    width: "calc(100vw - 240px)",
  },
  toolbar: {
    height: "66px",
    alignContent: "center",
  },
  kGrid: {
    height: "calc(100vh - 135px)",
  },
  loading: {
    top: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    color: Colors.almost_black,
    textTransform: "capitalize",
    fontFamily: "Sora",
  },
}));

export default KendoGridStyles;
