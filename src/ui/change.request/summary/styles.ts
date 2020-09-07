import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { SIDEBAR_WIDTH } from "../../documentRevision/Sidebar/styles";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: Colors.light_gray,
      display: "flex",
      marginTop: theme.spacing(5),
    },
    appFrame: ({ isDrawerOpen }) => ( {
      flexGrow: 1,
      padding: theme.spacing(3, 0, 3, 3),
      paddingRight: isDrawerOpen ? SIDEBAR_WIDTH : theme.spacing(5),
      transition: theme.transitions.create("paddingRight", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  }));
