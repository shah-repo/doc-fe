import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  cRoot: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 135px)",
    width: "calc(100vw - 280px)",
  },
  toolbar: {
    height: "66px",
    alignContent: "center",
  },
  groupCell: {
    whiteSpace: "pre-wrap",
  },
  link: {
    fontSize: 14,
    fontFamily: "Sora",
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    color: Colors.almost_black,
    textTransform: "capitalize",
    fontFamily: "Sora",
  },
  errorClass: {
    color: Colors.red,
  },
  dropboxButton: {
    display: "flex",
  },
}));

export default KendoGridStyles;
