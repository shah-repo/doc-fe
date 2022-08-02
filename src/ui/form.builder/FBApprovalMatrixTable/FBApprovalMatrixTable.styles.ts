import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const FBApprovalMatrixTableClasses = makeStyles((theme: Theme) => createStyles({
  tableRoot: {
    "background": Colors.white,
    "border": `1px solid ${Colors.light_gray_blue}`,
    "overflow": "hidden",
    "position": "relative",
    "& tr:last-child td": {
      borderBottom: "none",
    },
  },
  tableInfo: {
    "width": "100%",
    "zIndex": 2,
    "tableLayout": "fixed",
    "& th": {
      height: "60px!important",
      backgroundColor: Colors.water,
      color: "#252525",
      fontSize: "12px",
    },
    "& td": {
      height: "55px!important",
      fontSize: "12px",
    },
  },
  tableStatus: {
    "& td": {
      height: "55px!important",
      fontSize: "12px",
    },
    "& th": {
      maxHeight: "30px!important",
      minHeight: "30px!important",
      fontSize: "12px",
      backgroundColor: Colors.water,
      color: "#252525",
    },
  },
  wrapperStatus: {
    borderLeft: `1px solid ${Colors.light_gray_blue}`,
    overflowX: "auto",
    overflowY: "hidden",
  },
}));

export default FBApprovalMatrixTableClasses;
