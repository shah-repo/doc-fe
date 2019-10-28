import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    documentRevision: {
      margin: "10px",
    },
    appBar: {
      position: "relative",
      backgroundColor: "white",
    },
    dialogContent: {
      display: "contents",
    },
    doneButton: {
      margin: "20px 50px",
    },
    documentRevisionContainer: {
      display: "flex",
      justifyContent: "start",
      flexWrap: "wrap",
      marginBottom: 10,
    },
  });
