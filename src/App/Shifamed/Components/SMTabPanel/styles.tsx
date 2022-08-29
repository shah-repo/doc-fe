import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  content: {
    overflowY: "auto",
    margin: theme.spacing(0, -2, 0),
    padding: theme.spacing(0, 2, 0),
  },
}));
