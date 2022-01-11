import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "right",
    marginLeft: theme.spacing(0.625),
    fontFamily: "Sora",
  },
  cRoot: {
    width: "99%",
    margin: theme.spacing(0.625),
  },
  kGrid: {
    width: "calc(100vw - 263px)",
    height: "calc(100vh - 105px)",
  },
  loading: {
    top: 0,
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
