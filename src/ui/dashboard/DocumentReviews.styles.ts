import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "hidden auto",
      minHeight: 0,
      padding: "20px",
    },
    link: {
      "color": "#2175FF",
      "width": "100%",
      "display": "block",
      "margin": "0 0 10px",
      "textAlign": "center",
      "textDecoration": "none",
      "padding": "15px 10px",
      "boxShadow": "0 1px 5px rgba(0, 0, 0, 0.15)",
      "&:hover": {
        textDecoration: "none",
        boxShadow: "0 0 11px rgba(33,33,33,.2)",
      },
    },
  });
