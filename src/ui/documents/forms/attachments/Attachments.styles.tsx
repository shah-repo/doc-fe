import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
    },
    title: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    content: {
      marginTop: theme.spacing.unit * 2,
      clear: "both",
    },
  });
