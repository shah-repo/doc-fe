import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    toolbarTitle: {
      flex: 1,
    },
    headerLink: {
      "textDecoration": "none",
      "color": theme.palette.grey[900],
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  });
