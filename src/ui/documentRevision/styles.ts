import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    whiteContainer: {
      marginTop: theme.spacing(5),
      margin: 0,
      height: "auto",
      transition: theme.transitions.create("all", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    backColor: {
      background: Colors.light_gray,
    },
    openButton: {
      "marginTop": theme.spacing(3),
      "&:hover, :focus": {
        background: "#none",
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
    sidebar: {
      "&.MuiGrid-item.MuiGrid-grid-xs-2": {
        paddingTop: theme.spacing(12),
      },
      "&.MuiGrid-item.MuiGrid-grid-xs-3": {
        paddingTop: theme.spacing(12),
      },
    },
    sidebarItemTitle: {
      position: "fixed",
      zIndex: 1,
      width: "100%",
      textTransform: "uppercase",
      padding: "30px",
      paddingLeft: theme.spacing(1.5),
    },
    sidebarContent: {
      "overflow": "auto",
      "height": "calc(97vh - 127px)",
      "&::-webkit-scrollbar": {
        display: "none",
      },
      "marginTop": theme.spacing(1),
    },
    border: {
      width: "60%",
      backgroundColor: Colors.hint_gray,
      height: "1px",
      border: 0,
    },
    transitions: {
      transition: theme.transitions.create("all", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  })
);
