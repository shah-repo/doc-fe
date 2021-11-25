import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      overflow: "hidden",
      boxShadow:
        "rgb(0 0 0 / 10%) 0px 6px 6px -3px, rgb(0 0 0 / 7%) 0px 10px 14px 1px, rgb(0 0 0 / 6%) 0px 4px 18px 3px",
    },
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
