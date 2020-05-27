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
    },
    trainingText: {
      marginRight: 20,
    },
  });
