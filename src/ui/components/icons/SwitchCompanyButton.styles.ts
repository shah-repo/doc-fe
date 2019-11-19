import { createStyles, makeStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    switchButton: {
      left: 32,
      bottom: 70,
      position: "absolute",
      display: "flex",
      color: theme.palette.secondary.contrastText,
      background: "0% 0% no-repeat padding-box",
      borderRadius: 20,
      backgroundColor: theme.palette.secondary.contrastText,
      width: "fit-content",
      margin: "10px auto",
      cursor: "pointer",
    },
    switchButtonText: {
      fontSize: 14,
      fontWeight: 500,
      color: theme.palette.secondary.main,
      margin: "6px 23px",
    },
  }),
);

export default styles;
