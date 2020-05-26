import { createStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#F4F5F7",
      marginTop: "40px",
      margin: 0,
      width: "100%",
      height: "100%",
    },
    openButton: {
      "margin": "8px 13px 13px 11px",
      "&:hover, :focus": {
        background: "#none",

      },
    },
    iconButton: {
      "margin": "8px 13px 13px 11px",
      "paddingTop": "5px",
      "paddingBottom": "5px",
      "&:hover, &:focus, li.active > a": {
        // TODO blue hover, refactor new colors
        background: "#EDF4FF",
        borderRadius: "5px",
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
      marginTop: "10px",
    },
    sidebarContent: {
      "overflow": "auto",
      "height": "calc(97vh - 127px)",
      "&::-webkit-scrollbar": {
        display: "none",
      },
      "backgroundColor": Colors.white,
    },
  });
