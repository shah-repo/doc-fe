import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: "auto",
      minHeight: "calc(100vh - 185px)",
      maxHeight: "calc(100vh - 185px)",
    },
    grid: {
      marginTop: 5,
    },
  })
);
