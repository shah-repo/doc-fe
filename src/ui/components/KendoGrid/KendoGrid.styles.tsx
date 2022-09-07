import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const KendoGridStyles = makeStyles((theme) => ({
  grid: {
    height: "calc(100vh - 144px)",
  },
  headerGridItem: {
    padding: "16px 30px",
    backgroundColor: Colors.white,
  },
  kendoGridItem: {
    padding: "10px 30px 0px",
  },
}));
export default KendoGridStyles;
