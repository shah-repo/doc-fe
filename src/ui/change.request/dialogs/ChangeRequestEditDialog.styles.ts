import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    pointerEvents: "none",
  },
  container: {
    // justifyContent: "flex-end",
    // alignItems: "flex-start",
  },
  paper: {
    pointerEvents: "auto",
    minWidth: "80%",
    minHeight: "800px",
  },
  close: {
    // margin: theme.spacing(-.5),
    height: "28px",
    width: "28px",
    backgroundColor: "#F4F4F4",
    // opacity: 0.1,
    borderRadius: "6px",
    margin: "0 10px",
  },
  content: {
    padding: 0,
  },
  actions: {
    padding: 0,
    backgroundColor: theme.palette.common.white,
  },
  heading: {
    fontWeight: 600,
    fontSize: "14px",
    flex: 1,
    color: "#080B11",
  },
}));
