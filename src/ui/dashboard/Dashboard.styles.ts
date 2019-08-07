import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: "auto",
      flex: 1,
    },
    item: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
    },
    createDocumentLink: {
      textDecoration: "none",
    },
    buttons: {
      display: "block",
      clear: "both",
      height: 50,
    },
    actionsContainer: {
      padding: 20,
    },
  });
