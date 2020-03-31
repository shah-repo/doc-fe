import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      maxWidth: 1024,
      width: "100%",
      paddingBottom: theme.spacing(3),
    },
  });
