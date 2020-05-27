import { InputLabel, Theme } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Colors from "../../../layout/theme/utils/colors";

export const InputField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(4),
        padding: "2px 0 0 0",
      },
      "fontFamily": "Open Sans, sans-serif;",
    },
    input: {
      position: "relative",
      backgroundColor: Colors.white,
      fontSize: theme.spacing(2),
      width: "auto",
      padding: theme.spacing(2),
      flex: 1,
      border: `1px solid ${theme.palette.text.hint}`,
      fontFamily: "Open Sans, sans-serif;",
    },
  }),
)(InputBase);

export const LabelField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      transform: "translate(0, 1px) scale(0.97)",
      fontFamily: "Open Sans, sans-serif;",
    },
  }),
)(InputLabel);
