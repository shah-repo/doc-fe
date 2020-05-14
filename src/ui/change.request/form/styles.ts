import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#fff",
      padding: theme.spacing(0),
      marginTop: theme.spacing(2.5),
    },
  });
