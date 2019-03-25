import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    progress: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  });
