import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: (props) =>  ({
    "& .k-grid-header": {
      "pointer-events": props?.isDocumentReleased ? "none" : "auto",
    },
    "& .k-grid-column-menu.k-grid-filter": {
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
  }),
}));
export default useStyles;
