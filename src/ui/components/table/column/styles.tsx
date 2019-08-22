import { Link, TableCell } from "@material-ui/core";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";

export const StyledTableHeader = withStyles((theme) => ({
  head: {
    // *TO DO: theming palette
    // backgroundColor: theme.palette.common.black,
    "backgroundColor": "#aeb8d6",
    "color": theme.palette.common.white,
    "display": "flex",
    "margin": 0,
    "padding": "0!important",
    "fontSize": 14,
    "& .columnBox": {
      "display": "column",
      "flex": 1,
      "& .headerText": {
        padding: theme.spacing(2),
        color: theme.palette.common.white,
      },
      "& .headerField": {
        backgroundColor: "#e8e9ed",
        padding: theme.spacing(0, 1),
      },
    },
  },
}))(TableCell);

export const StyledTableCell = withStyles((theme) => ({
  body: {
    "display": "flex",
    "flex": 1,
    "margin": theme.spacing(0),
    "cursor": "inherit",
    "border": "none",
    "& .columnLink": {
      "textDecoration": "none",
      "color": theme.palette.text.primary,
      "flex": 1,
      "&:hover": {
        textDecoration: "none",
        color: theme.palette.text.primary,
      },
    },
  },
}))(TableCell);

export const StyledCellLink = withStyles((theme) => ({
  root: {
    color: "#c42127",
    cursor: "pointer",
  },
}))(Link);

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    columnBox: {
      display:  "column",
      flex: 1,
    },
    headerSpan: {
      padding: theme.spacing(2),
    },
    headerField: {
      backgroundColor: "#e8e9ed",
      padding: theme.spacing(1, 2),
    },
  }),
);
