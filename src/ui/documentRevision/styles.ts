import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#fff",
      padding: 0,
      margin: 0,
      width: "100%",
    },
    iconButton: {
      "margin": "8px 13px 13px 11px",
      "&:hover": {
        background: "#EDF4FF",
        borderRadius: "5px",
      },
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
