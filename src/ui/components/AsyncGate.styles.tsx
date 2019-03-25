import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    errorContainer: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      display: "flex",
      alignItems: "center",
    },
    tryAgainButton: {
      marginLeft: theme.spacing.unit,
    },
    progress: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  });
