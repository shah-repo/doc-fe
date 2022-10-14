import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2.5),
  },
  list: {
    margin: theme.spacing(1.5, -2.5, 0),
  },
  link: {
    textDecoration: "none",
  },
}));

export const itemStyles = (theme: Theme) => ({
  link: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
  },
  text: {
    ...theme.typography.body1,
    lineHeight: 1.25,
  },
  icon: {
    alignSelf: "flex-start",
    marginTop: theme.spacing(.25),
  },
});
