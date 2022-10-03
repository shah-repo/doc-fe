import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: Colors.alabaster,
      display: "flex",
      height: "calc(100vh - 51px)",
      padding: "0px",
      maxWidth: "100%",
      margin: "0px",
    },
    appFrame: ({ isDrawerOpen }) => ( {
      flexGrow: 1,
      transition: theme.transitions.create("paddingRight", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  }));
