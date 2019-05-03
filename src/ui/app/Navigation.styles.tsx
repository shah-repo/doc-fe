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
    },
    toolbar: theme.mixins.toolbar,
    link: {
      display: "flex",
      textDecoration: "none",
      padding: theme.spacing.unit,
      flex: 1,
    },
    activeLink: {
      backgroundColor: theme.palette.grey[300],
    },
    linkButton: {
      padding: 0,
    },
  });
