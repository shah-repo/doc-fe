import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      width: 300,
    },
    tab: {
      minWidth: 66,
      fontSize: "10px",
    },
    outline: {
      // border: "1px solid grey",
      overflow: "auto",
      height: "auto",
    },
    title: {
      fontStyle: "normal",
    },
    listRoot: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    allTab: {
      position: "absolute",
      width: "5px !important",
      height: "5px !important",
      left: "0px",
      top: "20px",
      background: "#767B87",
      borderRadius: "50%",
    },
    overdueTab: {
      position: "absolute",
      width: "5px !important",
      height: "5px !important",
      left: "0px",
      top: "20px",
      background: "#F14822",
      borderRadius: "50%",
    },
    dueInSevenTab: {
      position: "absolute",
      width: "5px !important",
      height: "5px !important",
      left: "0px",
      top: "20px",
      background: "#FEAA2C",
      borderRadius: "50%",
    },
  })
);
