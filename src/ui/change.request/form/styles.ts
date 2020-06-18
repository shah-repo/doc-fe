import { createStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      marginTop: theme.spacing(5),
      margin: 0,
      height: "100%",
      transition: theme.transitions.create("all", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    backColor: {
      background: Colors.light_gray,
    },
  });
