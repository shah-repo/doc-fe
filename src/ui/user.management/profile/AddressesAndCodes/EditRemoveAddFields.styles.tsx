import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      width: "auto",
      margin: theme.spacing(2.5, 0, 0, 0),
      padding: theme.spacing(0),
      marginBottom: "10px",
    },
    containedButton: {
      width: "auto",
      marginLeft: theme.spacing(0),
      color: "#fff",
      backgroundColor: "#6E09EA",
    },
    outlinedButton: {
      width: "auto",
      color: "#6E09EA",
      borderColor: "#6E09EA",
    },
    shareholder: {
      marginTop: "16px",
    },
    inputField: {
      height: "36px",
      width: "500px",
      paddingLeft: "5px",
      color: "#4d4d4d",
      fontSize: "0.885rem",
      fontFamily: "Open Sans, sans-serif",
      borderRadius: "4px",
      borderStyle: "ridge",
    },
    title: {
      marginBottom: "16px",
      marginTop: "16px",
    },
    removeButton: {
      borderStyle: "none",
      background: "none",
      cursor: "pointer",
    },
  }),
);
