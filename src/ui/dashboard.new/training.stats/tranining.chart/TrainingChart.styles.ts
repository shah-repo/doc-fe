import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    chartContainer: {
      overflow: "auto",
      marginLeft: "10%",
      marginTop: "10%",
      maxHeight: "calc(100vh- 145px)",
      minHeight: "calc(100vh- 145px)",
    },
    title: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
    },
    scroll: {
      height: "280px",
      maxHeight: "calc(100vh - 145px)",
    },
  })
);
