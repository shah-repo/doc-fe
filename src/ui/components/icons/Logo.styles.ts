import { createStyles, makeStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    svgRoot: {
      height: "auto",
      width: "60%",
    },
    letters: {
      color: theme.palette.secondary.contrastText,
    },
    icon: {
      color: theme.palette.secondary.light,
    },
    envCnt: {
      background: "0% 0% no-repeat padding-box",
      borderRadius: 15,
      backgroundColor: theme.palette.secondary.contrastText,
      width: "fit-content",
      margin: "10px auto",
    },
    evnTxt: {
      textAlign: "left",
      fontSize: 12,
      fontWeight: "bold",
      letterSpacing: 0,
      color: theme.palette.secondary.dark,
      margin: "10px 20px",
    }
  }),
);

export default styles;