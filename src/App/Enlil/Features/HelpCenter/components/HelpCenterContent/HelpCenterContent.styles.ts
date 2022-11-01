import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    pointerEvents: "none",
  },
  container: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  paper: {
    pointerEvents: "auto",
    maxWidth: theme.spacing(40),
  },
  close: {
    margin: theme.spacing(-.5),
  },
  content: {
    padding: 0,
  },
  actions: {
    padding: 0,
    backgroundColor: theme.palette.common.white,
  },
}));
