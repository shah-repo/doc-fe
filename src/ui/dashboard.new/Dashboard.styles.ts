import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
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
    trainingStats: {
      flexGrow: 1,
      paddingTop: "80px",
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
    },
  })
);
