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
      overflow: "hidden",
      borderRight: "none",
    },
    toolbar: {
      backgroundColor: Colors.mirage,
      marginTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      flexShrink: 0,
    },
    toolbarTitle: {
      flex: 1,
      textAlign: "center",
    },
    headerLink: {
      textDecoration: "none",
      color: theme.palette.common.white,
    },
    list: {
      flexGrow: 1,
      overflowX: "hidden",
      overflowY: "auto",
    },
  });
