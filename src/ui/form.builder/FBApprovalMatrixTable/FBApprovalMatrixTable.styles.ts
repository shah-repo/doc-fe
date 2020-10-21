import { makeStyles } from "@material-ui/core";

export const FBApprovalMatrixTableClasses = makeStyles({
  tableInfo: {
    "width": "100%",
    "tableLayout": "fixed",
    "& th": {
      height: "60px!important",
      backgroundColor: "#f6f7f7",
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
      backgroundColor: "#f6f7f7",
      color: "#252525",
    },
  },
});

export default FBApprovalMatrixTableClasses;
