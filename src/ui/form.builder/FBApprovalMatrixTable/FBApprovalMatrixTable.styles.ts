import { makeStyles } from "@material-ui/core";

export const FBApprovalMatrixTableClasses = makeStyles({
  root: {
    "width": "100%",
    "tableLayout": "fixed",
    "& th": {
      backgroundColor: "#f6f7f7",
      color: "#252525",
      height: "30px!important",
      padding: "0 5px",
    },
    "& td": {
      fontSize: "12px",
    },
  },
  tableInfo: {
    // "width": "100%",
    // "tableLayout": "fixed",
    "& th": {
      height: "60px!important",
      backgroundColor: "#f6f7f7",
      color: "#252525",
      padding: "0 5px",
      fontSize: "12px",
    },
    "& td": {
      height: "55px!important",
      fontSize: "12px",
    },

  },
  tableStatus: {
    // "width": "100%",
    // "tableLayout": "fixed",
    "& td": {
      height: "55px!important",
      minWidth: "80px",
      fontSize: "12px",
    },
    "& th": {
      maxHeight: "30px!important",
      minHeight: "30px!important",
      fontSize: "12px",
      // fontSize: "12px",
      backgroundColor: "#f6f7f7",
      color: "#252525",
      padding: "0 5px",
    },
    "& .FBStatus-root": {
      "& th": {
        minWidth: "80px",
        whiteSpace: "nowrap",
      },
    },
  },
});

export default FBApprovalMatrixTableClasses;
