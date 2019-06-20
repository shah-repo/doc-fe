import { Link, TableCell, Theme, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const StyledTableHeader = withStyles((theme) => ({
  head: {
    // *TO DO: theming palette
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#aeb8d6",
    color: theme.palette.common.white,
    display: "flex",
    margin: 0,
    fontSize: 14,
  },
}))(TableCell);

export const StyledTableCell = withStyles((theme) => ({
  body: {
    display: "flex",
    flex: 1,
    margin: theme.spacing(0),
    cursor: "inherit",
    border: "none",
  },
}))(TableCell);

export const StyledCellLink = withStyles((theme) => ({
  root: {
    color: "#c42127",
    cursor: "pointer",
  },
}))(Link);

export const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    fontSize: "13px",
  },
}))(Tooltip);
