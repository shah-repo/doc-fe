import { createStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      textDecoration: "none",
      flex: 1,
      color: "#fff",
    },
    childLink: {
      paddingLeft: theme.spacing(3),
    },
    activeLink: {
      backgroundColor: "#fff",
      "& .MuiListItemText-root": {
        backgroundColor: theme.palette.secondary.main,
        opacity: 1,
      },
    },
    linkButton: {
      padding: 0,
    },
    item: {
      margin: theme.spacing(0, 0, 0, 0.6),
      padding: theme.spacing(1.6, 1, 1.6, 1.8),
      opacity: 0.5,
      "& .MuiListItemText-primary": {
        color: "#fff",
      },
    },
  });
