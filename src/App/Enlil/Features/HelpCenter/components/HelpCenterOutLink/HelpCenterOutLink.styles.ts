import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    ...theme.typography.body2,
    display: "flex",
    alignItems: "center",
    color: theme.palette.primary.light,
    marginTop: theme.spacing(.5),
  },
  icon: {
    marginLeft: theme.spacing(.5),
  },
}));
