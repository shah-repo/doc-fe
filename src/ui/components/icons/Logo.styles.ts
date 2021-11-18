import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

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
      fontWeight: 600,
      letterSpacing: 0,
      margin: "10px 15px",
      lineHeight: "28px",
      fontFamily: "Sora",
    },
    evnTxtDev: {
      background: Colors.bright_blue,
    },
    evnTxtDemo: {
      background: Colors.deep_pink,
    },
  }),
);

export default styles;
