import { makeStyles } from "@material-ui/core";

export const styles = makeStyles(theme => ({
  paper: {
    //maxWidth: 1620,
    //width: "70%",
    height: "100%",
    marginTop: 100,
  },
  title: {
    position: "fixed",
    top: 0,
    background: "white",
    width: "100%",
    left: 0,
  },
  content: {
    marginTop: 20,
    overflow: "hidden",
  },
}));
