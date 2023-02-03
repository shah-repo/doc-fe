import { createStyles, makeStyles, Theme } from "@material-ui/core";

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
        "backgroundColor": "#F2F4F6 !important",
        "border-bottom-left-radius": "100px",
        "border-top-left-radius": "100px",
      },
      "border-bottom-left-radius": "100px",
      "border-top-left-radius": "100px",
    },
    hoverArrow: {
      "&:hover": {
        "backgroundColor": "#F2F4F6 !important",
        "border-bottom-right-radius": "100px",
        "border-top-right-radius": "100px",
      },
      "border-bottom-right-radius": "100px",
      "border-top-right-radius": "100px",
    },
  }),
);
