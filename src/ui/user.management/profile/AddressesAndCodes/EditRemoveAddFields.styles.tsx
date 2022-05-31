import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      width: "auto",
      margin: theme.spacing(2.5, 0, 0, 2.5),
      padding: theme.spacing(0),
    },
    containedButton: {
      width: "auto",
      marginLeft: theme.spacing(0),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.secondary.main,
    },
    outlinedButton: {
      width: "auto",
      color: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
    },
    values: {
      marginTop: "16px",
    },
    inputField: {
      height: "36px",
      width: "500px",
      paddingLeft: "5px",
      color: theme.palette.text.primary,
      fontSize: "0.885rem",
      borderRadius: "4px",
      borderStyle: "ridge",
    },
    title: {
      marginTop: "16px",
    },
    removeButton: {
      borderStyle: "none",
      background: "none",
      cursor: "pointer",
    },
  }),
);
