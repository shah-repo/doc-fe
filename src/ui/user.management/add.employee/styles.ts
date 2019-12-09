import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
      backgroundColor: "white",
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
  }),
);
