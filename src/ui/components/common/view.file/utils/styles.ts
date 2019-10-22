import { makeStyles } from "@material-ui/core";

export const styles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    marginTop: 100,
    boxShadow: "unset",
    backgroundColor: "transparent",
  },
  title: {
    position: "fixed",
    top: 0,
    background: "white",
    width: "100%",
    left: 0,
  },
  content: {
    overflow: "hidden",
  },
  buttonsContainer: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    marginRight: 30,
  },
}));
