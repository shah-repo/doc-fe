import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: 10,
    },
    documentRevision: {
      margin: "10px 0",
      width: "100%",
    },
    documentRevisionContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      margin: "10px 0",
    },
  });
