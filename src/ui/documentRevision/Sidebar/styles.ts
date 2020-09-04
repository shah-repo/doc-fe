import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const SIDEBAR_WIDTH = 300;

export default makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      marginTop: "105px",
      position: "fixed",
      height: "100%",
      overflow: "auto",
      width: SIDEBAR_WIDTH,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      width: 60,
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    drawerInner: {
      width: SIDEBAR_WIDTH,
      height: "calc(100% - 105px)",
      display: "flex",
      flexDirection: "column",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      minHeight: "10px",
    },
    sidebarList: {
      height: "calc(100% - 60px)",
      overflow: "auto",
      paddingRight: "17px",
      minWidth: "calc(100% + 17px)",
    },
    menuIcon: {
      "margin": "8px 13px 13px 11px",
      "paddingTop": "5px",
      "paddingBottom": "5px",
      "justifyContent": "end",
      "&:hover": {
        background: "none",
      },
    },
    iconButton: {
      "margin": "8px 13px 13px 11px",
      "paddingTop": "5px",
      "paddingBottom": "5px",
      "&:hover, &:focus, li.active > a": {
        "background": Colors.light_blue,
        "borderRadius": "5px",
        "& svg": {
          stroke: Colors.medium_blue,
        },
      },
      "& svg": {
        stroke: Colors.hint_gray,
      },
    },
    titleOfRevision: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);
