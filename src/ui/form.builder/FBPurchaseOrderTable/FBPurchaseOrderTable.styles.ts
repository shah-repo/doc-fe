import { makeStyles } from "@material-ui/core";

export const FBPurchaseOrderClasses = makeStyles({
  table: {
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
  },
  tableDetails: {
    "& th": {
      whiteSpace: "nowrap",
    },
    "& td": {
      padding: "14px 8px",
      whiteSpace: "nowrap",
    },
  },
});

export default FBPurchaseOrderClasses;
