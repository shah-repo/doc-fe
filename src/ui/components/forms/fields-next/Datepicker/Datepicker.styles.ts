import { createStyles, makeStyles } from "@material-ui/core";
import { Colors } from "../../../../layout/theme-next";

export const useStyles = makeStyles((theme) => createStyles({
  popover: {
    ...theme.overrides?.MuiMenu?.paper,
    marginLeft: 38,
  },
}));

export const useInputStyles = makeStyles((theme) => createStyles({
  endAdorment: {
    "cursor": "pointer",
    "height": "auto",
    "padding": theme.spacing(1.5),
    "&:hover": {
      color: Colors.textBlack,
    },
  },
  endAdormentDisabled: {
    color: Colors.textDisabled,
  },
}));
