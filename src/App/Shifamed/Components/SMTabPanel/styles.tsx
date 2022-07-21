import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles(() =>
  createStyles({
    content: {
      overflowY: "auto",
      height: "100vh",
      paddingBottom: "100%",
    },
  })
);
