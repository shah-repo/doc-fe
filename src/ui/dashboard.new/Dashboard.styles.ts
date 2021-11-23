import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: "auto",
      flex: 1,
      overflowX: "hidden",
      overflowY: "auto",
      height: "calc(100vh - 120px)",
    },
    item: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
    },
    trainingStats: {
      flexGrow: 1,
      paddingTop: "65px",
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
    },
  })
);
