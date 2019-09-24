import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    editorContainer: {
      display: "inline-block",
      width: "50%",
      padding: 10,
      height: "100%",
    },
    editor: {
      width: "100%",
      height: "59vh",
      maxHeight: "59vh",
      overflow: "auto",
      display: "inline-block",
    },
    hiddenEditor: {
      display: "none",
    },
    fullWidth: {
      width: "100%",
    },
    font: {
      fontWeight: 500,
    },
  }),
);
