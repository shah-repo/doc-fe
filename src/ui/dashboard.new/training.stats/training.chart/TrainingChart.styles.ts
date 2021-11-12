import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    chartContainer: {
      paddingTop: "60px",
      overflow: "auto",
      maxHeight: "calc(100vh - 300px)",
    },
    title: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "20px",
    },
    chartScroll: {
      position: "relative",
      width: "232px",
      height: "232px",
    },
  })
);
