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
      backgroundColor: theme.palette.secondary.contrastText,
      width: "100%",
      marginBottom: 20,
    },
    evnTxt: {
      textAlign: "center",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 0,
      fontFamily: "Sora",
    },
    evnTxtDev: {
      background: Colors.light_slate_blue,
    },
    evnTxtDemo: {
      background: Colors.cerulean,
    },
    logo: {
      marginTop: 20,
      paddingLeft: 24,
      paddingRight: 24,
    },
  }),
);

export default styles;
