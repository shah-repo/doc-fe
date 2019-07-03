import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    height: "100%",
  },
  item: {
    height: "75vh",
    width: "100%",
  },
  link: {
    textDecoration: "none",
  },
  button: {
    marginBottom: "25px",
  },
});
