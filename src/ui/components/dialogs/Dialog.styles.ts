import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
