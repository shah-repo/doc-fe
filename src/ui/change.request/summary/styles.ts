import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  box: {
    padding: theme.spacing(2, 0),
  },
  previewBox: {
    borderLeft: "1px solid #ccc",
    borderRight: "1px solid #ccc",
  },
  submitBox: {
    textAlign: "center",
  },
});
