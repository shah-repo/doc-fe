import { createStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
      background: theme.palette.secondary.main,
      zIndex: theme.zIndex.drawer + 2,
    },
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      marginTop: 20,
    },
    toolbarTitle: {
      flex: 1,
      textAlign: "center",
    },
    headerLink: {
      "textDecoration": "none",
      "color": theme.palette.common.white,
      "&:hover": {
        color: theme.palette.secondary.light,
      },
    },
  });
