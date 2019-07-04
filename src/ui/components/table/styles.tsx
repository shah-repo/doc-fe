import { makeStyles } from "@material-ui/core";
import { TableStyleProps } from "./types";

export const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  table: {
    fontFamily: theme.typography.fontFamily,
    innerHeight: "100%",
    fontSize: theme.typography.fontSize,
  },
  header: {
    margin: "0!important",
  },
  rowEven: {
    backgroundColor: "#e8e9ed",
  },
  rowOdd: {
    backgroundColor: "transparent",
  },
  row: (props: TableStyleProps) => ({
    paddingRight: "0!important",
    cursor: (props.isSelectable) ? "pointer" : "default",
  }),
}));
