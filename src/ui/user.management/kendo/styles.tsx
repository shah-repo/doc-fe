import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  cRoot: {
    width: "99%",
    margin: theme.spacing(0.625),
  },
  root: {
    textAlign: "right",
    marginLeft: theme.spacing(0.625),
    fontFamily: "Sora",
  },
  kGrid: {
    width: "calc(100vw - 263px)",
    height: "calc(100vh - 105px)",
  },
  groupCell: {
    whiteSpace: "pre-wrap",
  },
  link: {
    fontSize: 14,
    fontFamily: "Sora",
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
  errorClass: {
    color: Colors.red,
  },
  dropboxButton: {
    display: "flex",
    marginBottom: theme.spacing(1.25),
  },
}));

export default KendoGridStyles;
