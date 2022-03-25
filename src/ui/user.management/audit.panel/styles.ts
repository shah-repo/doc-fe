import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const SIDEBAR_WIDTH = 300;
export default makeStyles((theme: Theme) =>
  createStyles({
    outerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "15px 15px 15px 20px",
      position: "static",
      width: "300px",
      // height: "149px",
      left: "0px",
      top: "44px",
      background: "#FFFFFF",
      boxShadow: "0px 1px 0px #ccd4d9",
      flex: "none",
      order: 1,
      alignSelf: "stretch",
      flexGrow: 0,
      margin: "1px 0px",
    },
    listItem: {
      "padding": "13px 0px 0px 0px",
      "& .MuiListItemAvatar-root": {
        maxWidth: "35px",
        minWidth: "35px",
        marginRight: "8px",
      },
    },
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
      "justifyContent": "unset",
      "&:hover": {
        background: "none",
      },
    },


    avatar: {
      width: "35px",
      height: "35px",
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      fontFamily: "Sora",
      textTransform: "uppercase",
    },
    secondaryText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "12px",
      color: Colors.font_gray,
    },
    generalInfo: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      // lineHeight: "21px",
      color: "#162229",
      lineHeight: "150%",
      flex: "none",
      order: 0,
      flexGrow: 0,
      margin: " 0px 0px",
    },

    description: {
      fontWeight: 700,
      lineHeight: "21px",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
    },
  })
);
