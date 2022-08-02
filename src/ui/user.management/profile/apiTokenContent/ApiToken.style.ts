import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inputField: {
      width: "39%",
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "center",
    },
    dialogMessage: {
      fontWeight: "bold",
      paddingRight: 4,
    },
    copyKeyButton: {
      top: "210px",
      right: "27px",
      margin: 0,
      padding: 0,
      position: "absolute",
      cursor: "pointer",
      zIndex: 1,
    },
    copySecretButton: {
      top: "340px",
      right: "27px",
      margin: 0,
      padding: 0,
      position: "absolute",
      cursor: "pointer",
      zIndex: 1,
    },
    icon: {
      paddingRight: "3px",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    rootCustomStyle: {
      width: "50%",
      height: "250px",
    },
  }),
);
