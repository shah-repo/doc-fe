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
      background: "#29064C",
    },
    toolbar: {
      backgroundColor: "#29064C",
    },
    toolbarTitle: {
      flex: 1,
      textAlign: "center",
    },
    headerLink: {
      textDecoration: "none",
      color: theme.palette.common.white,
      "&:hover": {
        color: theme.palette.secondary.light,
      },
    },
    list: {
      padding: theme.spacing(3, 0),
    },
  });
