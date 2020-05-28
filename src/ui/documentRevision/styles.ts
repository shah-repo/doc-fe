import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: Colors.light_gray,
      marginTop: theme.spacing(5),
      margin: 0,
      width: "100%",
      height: "max-content",
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
      background: "white",
      zIndex: 1,
      width: "100%",
      paddingTop: theme.spacing(4),
      textTransform: "uppercase",
    },
    sidebarContent: {
      "overflow": "auto",
      "height": "calc(97vh - 127px)",
      "&::-webkit-scrollbar": {
        display: "none",
      },
      "backgroundColor": Colors.white,
      "width": "320px",
      "marginTop": theme.spacing(1),
    },
    border: {
      width: "60%",
      backgroundColor: Colors.hint_gray,
      height: "1px",
      border: 0,
    },
  })
);
