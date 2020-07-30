import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    height: "100%",
    padding: theme.spacing(4, 5),
  },
  item: {
    height: "77vh",
    width: "100%",
  },
  link: {
    textDecoration: "none",
  },
  button: {
    margin: "0px",
    boxShadow: "none",
  },
});
