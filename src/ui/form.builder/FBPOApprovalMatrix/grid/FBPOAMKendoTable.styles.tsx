import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "height": "calc(100vh - 496px)",
    "& .k-grouping-header.k-grouping-header-flex": {
      display: "none",
    },
    "& .k-grid-header.k-grid-draggable-header": {
      padding: theme.spacing(0),
    },
  },
}));
export default useStyles;
