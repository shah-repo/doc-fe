import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    outline: {
      overflow: "hidden",
      minHeight: "calc(100vh - 160px)",
      marginLeft: "10%",
    },
  })
);
