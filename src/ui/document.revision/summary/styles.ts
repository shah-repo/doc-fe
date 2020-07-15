import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    previewBox: {
      margin: 0,
      width: "100%",
      paddingLeft: theme.spacing(3),
      minHeight: "calc(100vh - 105px)",
    },
    trainingText: {
      marginRight: 20,
    },
  });
