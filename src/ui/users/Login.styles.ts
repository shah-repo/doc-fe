import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.grey[300],
    },
    paper: {
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing.unit,
    },
    form: {
      marginTop: theme.spacing.unit,
      width: "100%", // Fix IE 11 issue.
    },
  });
