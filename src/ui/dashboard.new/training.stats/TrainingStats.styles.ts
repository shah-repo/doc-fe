import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    outline: {
      overflow: "hidden",
      minHeight: "calc(100vh - 160px)",
      marginLeft: "10%",
    },
  })
);
