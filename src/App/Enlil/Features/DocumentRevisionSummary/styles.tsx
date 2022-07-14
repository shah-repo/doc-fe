import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles((theme) =>
  createStyles({
    container: {
      overflowY: "auto",
    },
    content: {
      paddingBottom: theme.spacing(8),
    },
  })
);
