import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    toolbar: {
      top: 18,
      left: "1.6%",
    },
    tabItemText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      marginLeft: 10,
    },
    tabItemCount: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
      fontWeight: 400,
    },
  })
);
