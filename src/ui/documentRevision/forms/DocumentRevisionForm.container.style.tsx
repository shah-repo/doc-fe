import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
      border: "none",
    },
    borderContainer: {
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
    },
  }),
);
