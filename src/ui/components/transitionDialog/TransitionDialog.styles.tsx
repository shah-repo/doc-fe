import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      width: "auto",
      margin: "auto",
      display: "inline-block",
    },
    button: {
      margin: theme.spacing.unit,
    },
  });
