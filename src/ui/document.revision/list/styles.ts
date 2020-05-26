import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    height: "100%",
    padding: "32px 40px",
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
  clearButton: {
    margin: "0px 16px 0px 0px",
    backgroundColor: theme.palette.common.white,
  },
});
