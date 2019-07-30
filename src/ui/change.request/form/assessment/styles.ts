import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    backgroundColor: "transparent",
    padding: theme.spacing(4, 0),
    flexGrow: 1,
    boxShadow: "none",
  },
  paragraph: {
    padding: theme.spacing(3, 0),
    display: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  close: {
    flex: 1,
    marginLeft: "100px",
    marginBottom: "-12px",
  },
  icon: {
    fontSize: "100px",
  },
  error: {
    color: "red",
  },
});
