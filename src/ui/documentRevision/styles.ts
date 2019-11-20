import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#fff",
      padding: theme.spacing(3, 0),
      margin: "0",
      width: "100%",
    },
    sidebar: {
      "&.MuiGrid-item.MuiGrid-grid-xs-2": {
        paddingTop: theme.spacing(12),
      },
      "&.MuiGrid-item.MuiGrid-grid-xs-3": {
        paddingTop: theme.spacing(12),
      },
    },
  });
