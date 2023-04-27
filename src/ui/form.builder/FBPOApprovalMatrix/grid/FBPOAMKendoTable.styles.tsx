import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .k-grid-header": {
      "pointer-events": "none",
    },
    "& .k-grouping-header.k-grouping-header-flex": {
      display: "none",
    },
    "& .k-grid-header.k-grid-draggable-header": {
      padding: theme.spacing(0),
    },
    "& .k-grid-norecords": {
      display: "none",
    },
  },
}));
export default useStyles;
