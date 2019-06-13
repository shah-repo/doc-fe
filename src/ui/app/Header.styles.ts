import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    appBar: {
      position: "absolute",
      zIndex: 1299,
    },
    toolbarTitle: {
      flex: 1,
    },
    headerLink: {
      "textDecoration": "none",
      "color": theme.palette.common.white,
      "&:hover": {
        color: theme.palette.secondary.light,
      },
    },
  });
