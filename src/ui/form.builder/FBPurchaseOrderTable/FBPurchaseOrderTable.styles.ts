import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const FBPurchaseOrderClasses = makeStyles({
  root: {
    "width": "100%",
    "tableLayout": "fixed",
    "& th": {
      padding: "14px 5px 14px 15px",
      whiteSpace: "nowrap",
      background: Colors.water,
      boxShadow: `{0 1px 0 ${Colors.chinese_silver}}`,
      borderRadius: "3px 0 0 0",
    },
    "& .FBTotal-root": {
      padding: "10px 8px",
      borderBottom: 0,
    },
    "& .FBIcon-root": {
      "color": "#c1c1c1",
      "marginTop": "5px",
      "&:hover": {
        color: "#888888",
      },
    },
  },
  table: {
    "& th": {
      whiteSpace: "nowrap",
      backgroundColor: Colors.athens_gray,
      cursor: "default",
    },
    "& tr": {
      cursor: "pointer",
      height: "47px",
      border: `1px solid ${Colors.chinese_silver}`,
    },
    "& td": {
      padding: "0px 8px",
      whiteSpace: "nowrap",
    },
  },
  button: {
    borderRadius: 0,
    borderStyle: "dashed",
    borderColor: Colors.dodger_blue,
    height: "40px",
  },
  list: {
    borderBottom: "none",
  },
  sum: {
    "verticalAlign": "baseline",
    "borderBottom": "none",
    "& tr": {
      borderLeft: 0,
      background: Colors.white,
    },
  },
});

export default FBPurchaseOrderClasses;
