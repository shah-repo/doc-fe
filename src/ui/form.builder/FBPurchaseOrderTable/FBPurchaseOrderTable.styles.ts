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
    "& tr": {
      cursor: "pointer",
      height: "45px",
    },
    "& td": {
      padding: "0px 8px",
      whiteSpace: "nowrap",
    },
    "& .FBCheck-root": {
      color: "#c1c1c1",
      marginTop: "5px",
    },
  },
});

export default FBPurchaseOrderClasses;
