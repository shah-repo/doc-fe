import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";
import { SIDEBAR_WIDTH } from "./Sidebar/styles";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: Colors.light_gray,
      display: "flex",
      marginTop: theme.spacing(5),
    },
    appFrame: ({ isDrawerOpen }) => ( {
      flexGrow: 1,
      paddingRight: isDrawerOpen ? SIDEBAR_WIDTH : theme.spacing(5),
      transition: theme.transitions.create("paddingRight", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),

  })
);
