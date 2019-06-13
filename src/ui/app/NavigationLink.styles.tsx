import { createStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      textDecoration: "none",
      padding: theme.spacing(1),
      flex: 1,
    },
    childLink: {
      paddingLeft: theme.spacing(3),
    },
    activeLink: {
      backgroundColor: theme.palette.grey[300],
    },
    linkButton: {
      padding: 0,
    },
    item: {
      padding: 0,
    },
  });
