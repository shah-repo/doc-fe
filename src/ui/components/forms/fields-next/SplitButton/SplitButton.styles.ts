import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  toggle: {
    paddingLeft: 0,
    paddingRight: theme.spacing(.25),
    minWidth: 36,
  },
  button: {
    paddingRight: theme.spacing(1.25),
  },
}));
