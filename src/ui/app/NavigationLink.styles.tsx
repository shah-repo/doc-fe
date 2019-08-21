import { createStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      textDecoration: "none",
      flex: 1,
    },
    childLink: {
      paddingLeft: theme.spacing(3),
    },
    activeLink: {
      "backgroundColor": theme.palette.primary.main,
      "& .MuiListItemText-root": {
        backgroundColor: theme.palette.background.default,
      },
    },
    linkButton: {
      padding: 0,
    },
    item: {
      margin: theme.spacing(0, 0, 0, 0.6),
      padding: theme.spacing(1.6, 1, 1.6, 1.8),
      backgroundColor: theme.palette.common.white,
    },
  });
