import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: 0,
    },
    documentRevisionContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      margin: "10px 0",
    },
    documentRevision: {
      margin: "10px 0",
      width: "100%",
    },
    assessmentFormButton: {
      margin: 0,
      borderRadius: theme.spacing(4),
      padding: theme.spacing(2, 1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    addDocument: {
      margin: 0,
    },
  });
