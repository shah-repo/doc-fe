import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    errorContainer: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      display: "flex",
      alignItems: "center",
    },
    tryAgainButton: {
      marginLeft: theme.spacing(1),
    },
    progress: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  });
