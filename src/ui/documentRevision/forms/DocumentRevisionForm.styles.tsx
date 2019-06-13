import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      marginTop: theme.spacing.unit * 3,
      maxWidth: 1024,
      width: "100%",
      paddingBottom: theme.spacing.unit * 3,
    },
  });
