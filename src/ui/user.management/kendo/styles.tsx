import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  cRoot: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 109px)",
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
