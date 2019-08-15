import { InputLabel, Theme } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, withStyles } from "@material-ui/core/styles";

export const InputField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
        padding: "2px 0 0 0",
      },
    },
    input: {
      // "backgroundColor": theme.palette.background.madefaultin,
      position: "relative",
      backgroundColor: "rgba(0, 0, 0, 0.09)",
      fontSize: theme.spacing(2),
      width: "auto",
      padding: theme.spacing(2),
      flex: 1,
    },
  }),
)(InputBase);

export const LabelField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      transform: "translate(0, 1px) scale(0.97)",
    },
  }),
)(InputLabel);
