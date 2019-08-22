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
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
      padding: theme.spacing(0, 5),
    },
    submitBox: {
      textAlign: "center",
    },
    whiteContainer: {
      background: "#fff",
      padding: theme.spacing(3, 0),
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
    summaryContainer: {
      padding: "0 40px",
    },
  });
