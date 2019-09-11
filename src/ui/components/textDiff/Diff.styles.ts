import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      maxHeight: 250,
      overflow: "auto",
      margin: "10px 0",
    },
  }),
);