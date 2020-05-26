import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#F4F5F7",
      padding: "30px",
      margin: 0,
      width: "100%",
      marginLeft: "-40px",
      marginBottom: "-32px",
      paddingRight: 0,
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
    },
    sidebarContent: {
      "overflow": "auto",
      "height": "calc(97vh - 127px)",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  });
