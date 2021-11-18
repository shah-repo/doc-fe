import { createStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
      background: Colors.mirage,
      zIndex: theme.zIndex.drawer + 2,
    },
    toolbar: {
      backgroundColor: Colors.mirage,
      marginTop: 20,
    },
    toolbarTitle: {
      flex: 1,
      textAlign: "center",
    },
    headerLink: {
      "textDecoration": "none",
      "color": theme.palette.common.white,
      "&:hover": {
        color: theme.palette.secondary.light,
      },
    },
  });
