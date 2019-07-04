import { TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";

export const selectStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2, 0, 1),
      minWidth: 120,
    },
    input: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(1),
    },
  }),
);

export const StyledSearchTextField = withStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1),
  },
}))(TextField);
