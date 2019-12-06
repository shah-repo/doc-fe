import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
      backgroundColor: "white",
    },
    dialogTitle: {
      marginLeft: "50%",
    },
  }),
);
