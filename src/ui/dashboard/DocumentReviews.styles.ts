import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "hidden auto",
      minHeight: 0,
    },
    link: {
      textDecoration: "none",
    },
    title: {
      margin: theme.spacing(2),
    },
    noReviews: {
      margin: theme.spacing(2),
    },
  });
