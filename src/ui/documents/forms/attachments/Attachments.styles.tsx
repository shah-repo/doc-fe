import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    title: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    content: {
      marginTop: theme.spacing(2),
      clear: "both",
    },
  });
