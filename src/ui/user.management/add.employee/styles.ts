import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
      backgroundColor: "white",
    },
    dialogContent: {
      display: "contents",
      padding: 50,
      color: "red",
    },
    dialogTitle: {
      marginLeft: "50%",
    },
  }),
);
