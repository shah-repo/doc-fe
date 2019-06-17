import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      marginTop: theme.spacing(3),
      maxWidth: 1024,
      width: "100%",
      paddingBottom: theme.spacing(3),
    },
  });
