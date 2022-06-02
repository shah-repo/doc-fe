import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: Colors.alabaster,
      display: "flex",
      height: "100%",
    },
    appFrame: ({ isDrawerOpen }) => ( {
      flexGrow: 1,
      padding: theme.spacing(2, 4.25, 4.25, 4.25),
      transition: theme.transitions.create("paddingRight", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  }));
