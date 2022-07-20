import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const FBApprovalMatrixTableClasses = makeStyles((theme: Theme) => createStyles({
  tableRoot: {
    background: Colors.white,
    border: `1px solid ${Colors.light_gray_blue}`,
    borderRadius: theme.spacing(0.5),
    overflow: "hidden",
  },
  tableInfo: {
    "width": "100%",
    "boxShadow": theme.shadows[16],
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
}));

export default FBApprovalMatrixTableClasses;
