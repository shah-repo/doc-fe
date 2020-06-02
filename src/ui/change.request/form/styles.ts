import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#fff",
      padding: theme.spacing(0),
      margin: theme.spacing(6, 0, 0, 1.5),
    },
  });
