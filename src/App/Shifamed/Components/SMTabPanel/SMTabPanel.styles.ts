import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  content: {
    overflowY: "scroll",
    margin: theme.spacing(-4, -2.75, 0, -2),
    padding: theme.spacing(8, 2, 0),
  },
}));
