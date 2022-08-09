import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  dialogRoot: {
    pointerEvents: "none",
  },
  dialogContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  dialogPaper: {
    pointerEvents: "auto",
    maxWidth: theme.spacing(40),
  },
  contentRoot: {
    padding: 0,
  },
  // TODO Move to overrides
  titleRoot: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
  },
  actionsRoot: {
    padding: 0,
  },
}));
