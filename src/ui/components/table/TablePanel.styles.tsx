import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      flexGrow: 1,
      minHeight: 0,
      padding: "20px",
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.down("xs")]: {
        height: "100%",
        minHeight: "200px",
      },
    },
    table: {
      fontFamily: theme.typography.fontFamily,
      innerHeight: "100%",
      fontSize: theme.typography.fontSize,
      "& .cellRow: nth-of-type(odd)": {
        backgroundColor: "#f2f2f2",
      },
    },
    headerRow: {
      margin: "0!important",
    },
    cellRow: {
      
    },
  },
));

