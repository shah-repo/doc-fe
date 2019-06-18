import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    table: {
      fontFamily: theme.typography.fontFamily,
      innerHeight: "100%",
      fontSize: theme.typography.fontSize,
    },
    headerRow: {
      margin: "0!important",
    },
    cellRow: {
      paddingRight: "0!important",
    },
    cellRowEven: {
      backgroundColor: "#e8e9ed",
    },
    cellRowOdd: {
      backgroundColor: "transparent",
    },
  },
));
