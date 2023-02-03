import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      minWidth: 400,
    },
    submitButton: {
      float: "right",
      clear: "right",
    },
    cancelButton: {
      float: "right",
      marginRight: theme.spacing(1),
    },
    passwordInput: {
      height: 40,
      marginTop: "0 !important",
    },
    dropDown: {
      top: "2px !important",
      width: "161px",
      left: "-10px",
    },
    buttonHover: {
      "&:hover": {
        backgroundColor: `${Colors.light_gray} !important`,
        borderTopLeftRadius: "100px",
      },
      "borderTopLeftRadius": "100px",
      "borderBottomLeftRadius": "100px",
    },
    hoverArrow: {
      "&:hover": {
        backgroundColor: `${Colors.light_gray} !important`,
        borderTopRightRadius: "100px",
      },
      "borderTopRightRadius": "100px",
      "borderBottomRightRadius": "100px",
    },
  }),
);
