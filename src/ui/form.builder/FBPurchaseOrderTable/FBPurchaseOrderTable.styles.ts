import { makeStyles } from "@material-ui/core";

export const FBPurchaseOrderClasses = makeStyles({
  root: {
    "width": "100%",
    "tableLayout": "fixed",
    "& th": {
      backgroundColor: "#f6f7f7",
      color: "#252525",
      padding: "14px 8px",
    },
    "& .FBTotal-root": {
      padding: "10px 8px",
    },
    "& .FBIcon-root": {
      "color": "#c1c1c1",
      "marginTop": "5px",
      "&:hover": {
        color: "#888888",
      },
    },
    "& .FBAmount-root": {
      width: "30%",
    },
  },
  table: {
    "& th": {
      whiteSpace: "nowrap",
    },
    "& tr": {
      cursor: "pointer",
      height: "45px",
    },
    "& td": {
      padding: "0px 8px",
      whiteSpace: "nowrap",
    },
  },
});

export default FBPurchaseOrderClasses;
