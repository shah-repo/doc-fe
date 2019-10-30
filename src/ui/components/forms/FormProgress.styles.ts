import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    progress: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      minWidth: 150,
    },
  });
