import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const FBApprovalMatrixTableClasses = makeStyles((theme: Theme) => createStyles({
  tableRoot: {
    background: Colors.white,
    border: `1px solid ${Colors.light_gray_blue}`,
    borderRadius: theme.spacing(0.5),
    overflow: "hidden",
    position: "relative",
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
  statusScroller: {
    "position": "absolute",
    "height": theme.spacing(2),
    "overflowX": "auto",
    "overflowY": "hidden",
    "right": 0,
    "bottom": 0,
    "marginBottom": theme.spacing(0.25),
    "&::-webkit-scrollbar:horizontal": {
      backgroundColor: "transparent",
      height: theme.spacing(1.5),
      width: theme.spacing(1.5),
    },
    "&::-webkit-scrollbar-thumb:horizontal": {
      backgroundColor: "var(--font_gray)",
      borderRadius: theme.spacing(1),
    },
  },
}));

export default FBApprovalMatrixTableClasses;
