import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    box: {
      padding: theme.spacing(2, 0),
    },
    previewBox: {
      padding: theme.spacing(0, 3),
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
      margin: 0,
      width: "100%",
    },
    headerContainer: {
      padding: "10px 0 60px",
    },
    status: {
      color: "#fff",
      background: theme.palette.text.hint,
      padding: "20px 25px",
      borderRadius: "60px",
    },
    crId: {
      color: theme.palette.text.hint,
    },
    trainingText: {
      marginRight: 20,
    },
  });
