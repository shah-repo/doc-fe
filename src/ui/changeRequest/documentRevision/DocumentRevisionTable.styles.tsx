import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      flexGrow: 1,
      minHeight: 0,
      padding: "20px",
      [theme.breakpoints.down("xs")]: {
        height: "100%",
        minHeight: "200px",
      },
    },
    table: {
      fontFamily: theme.typography.fontFamily,
      innerHeight: "100%",
      fontSize: theme.typography.fontSize,
    },
    flexContainer: {
      alignItems: "center",
      boxSizing: "border-box",
      margin: 0,
      wordWrap: 'break-word',
      marginRight: 20,
    },
    tableRow: {
      cursor: "pointer",
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    actions: {
      textAlign: "right",
      width: "100%",
    },
  });
