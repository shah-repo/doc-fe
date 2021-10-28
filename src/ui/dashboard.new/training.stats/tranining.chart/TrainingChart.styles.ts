import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    chartContainer: {
      overflow: "auto",
      marginLeft: "10%",
      marginTop: "10%",
    },
    title: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
    },
  })
);
