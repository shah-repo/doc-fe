import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  kGrid: {
    height: "calc(100vh - 119px)",
    width: "calc(100vw - 280px)",
  },
  groupCell: {
    whiteSpace: "pre-wrap",
  },
  link: {
    fontSize: 14,
    fontFamily: "Sora",
  },
  errorClass: {
    color: Colors.red,
  },
}));

export default KendoGridStyles;
