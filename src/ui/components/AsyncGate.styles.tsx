import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    errorContainer: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      display: "flex",
      alignItems: "center",
    },
    tryAgainButton: {
      marginLeft: theme.spacing(1),
    },
    progress: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    passiveContainer: {
      position: "relative",
    },
    passiveProgress: {
      width: "100%",
      marginTop: theme.spacing(1),
      position: "absolute",
      zIndex: 2,
    },
  });
