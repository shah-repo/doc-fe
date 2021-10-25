import { createStyles, makeStyles } from "@material-ui/core";
export const styles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    toolbar: {
      top: 18,
      left: 15,
    },
    tabItemText: {
      marginLeft: 10,
    },
  })
);
