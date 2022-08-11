import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const SIDEBAR_WIDTH = 300;

export default makeStyles((theme: Theme) =>
  createStyles({
    changeContainer: {
      boxShadow: `inset 0px 1px 1px -1px ${Colors.gray_goose}, inset 0px -1px 1px 0px ${Colors.gray_goose}`,
      padding: theme.spacing(1.875),
    },
    listItem: {
      "padding": "0px 0px 0px 0px",
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
    iconButtonNew: {
      "width": "36px",
      "height": "30px",
      "padding": "0px",
      "margin": "9px 6px 0px 6px",
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
    avatar: {
      width: "35px",
      height: "35px",
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      textTransform: "uppercase",
    },
    secondaryText: {
      fontSize: "12px",
      color: Colors.font_gray,
    },
    generalInfo: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.almost_black,
    },
    linkButton: {
      textDecoration: "none",
      color: Colors.navy,
      fontSize: "14px",
    },
    references: {
      overflowX: "hidden",
      overflowY: "auto",
    },
    bgIsActiveTab: {
      "background": Colors.light_blue,
      "borderRadius": "5px",
      "& svg": {
        stroke: Colors.medium_blue,
      },
    },
  })
);
