import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    chartContainer: {
      overflow: "auto",
      marginLeft: "10%",
      marginTop: "10%",
      maxHeight: "calc(100vh- 145px)",
    },
    title: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "20px",
      marginTop: "30px",
    },
    chartScroll: {
      position: "relative",
      width: "232px",
      height: "232px",
      left: "29px",
      maxHeight: "calc(100vh - 145px)",
    },
  })
);
