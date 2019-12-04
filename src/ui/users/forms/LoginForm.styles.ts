import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    status: {
      marginTop: theme.spacing(3),
    },
    submit: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginLeft: 0,
    },
    navigationLink: {
      color: theme.palette.primary.main,
      marginLeft: theme.spacing(1),
      textDecoration: "none",
    },
  });
