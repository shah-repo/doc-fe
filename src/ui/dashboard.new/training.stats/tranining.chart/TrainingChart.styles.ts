import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    chartContainer: {
      overflow: "auto",
      // minHeight: 300,
      // height: 300,
      // width: 400,
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
