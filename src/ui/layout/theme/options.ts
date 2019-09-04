import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Config from "../../../config";
import { ThemeEnv } from "../../../config/types";
import { ThemePalette } from "./palette";
// import { muiTheme } from "./palette";

const appPalette = ThemePalette[Config.Theme as ThemeEnv];

export const muiTheme = createMuiTheme();

export default createMuiTheme({
  ...muiTheme,
  palette: appPalette,
  overrides: {
    MuiAppBar: {
      colorDefault: {
        background: appPalette.common.white,
      },
      colorPrimary: {
        background: "transparent",
        backgroundColor: "transparent",
        color: "#4d4d4d",
      },
      root: {
        boxShadow: "none",
      },
    },
    MuiTypography: {
      root: {
        fontFamily: "Open Sans, sans-serif;",
      },
      body2: {
        color: "#8A9DAD",
        fontSize: "0.8rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      subtitle1: {
        color: "#4d4d4d",
        fontSize: "0.875remrem",
        fontFamily: "Open Sans, sans-serif;",
      },
      subtitle2: {
        color: "#4d4d4d",
        fontSize: "0.8rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      h5: {
        color: "#4d4d4d",
        fontSize: "1rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      h4: {
        color: "#4d4d4d",
        fontSize: "1.4rem",
      },
      h6: {
        fontSize: "1.1rem",
        fontWeight: "normal",
        fontFamily: "Open Sans, sans-serif;",
      },
    },
    MuiButton: {
      root: {
        fontSize: "0.75rem",
        borderRadius: 3,
        margin: muiTheme.spacing(1),
        fontFamily: "Open Sans",
        fontWeight: "bold",
      },
    },
    MuiLink: {
      root: {
        fontSize: "0.8rem",
      },
    },
    MuiTableCell: {
      root: {
        fontSize: "0.8rem",
      },
      head: {
        ffontSize: "0.81rem",
        background: "#5C9DFF",
        color: appPalette.common.white,
        fontFamily: "Open Sans",
        fontWeight: "bold",
      },
    },
    MuiInputBase: {
      root: {
        fontSize: "0.8rem",
      },
      input: {
        fontSize: "0.8rem",
      },
    },
    MuiSelect: {
      root: {
        fontSize: "0.8rem",
      },
      icon: {
        right: "10px",
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "0.8rem",
        maxWidth: "350px",
        overflowWrap: "break-word",
        wordWrap: "break-word",
        hyphens: "auto",
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: "0.8rem",
      },
    },
    MuiListItemText: {
      primary: {
        fontSize: "0.9rem",
        color: "#4d4d4d",
      },
    },
    MuiExpansionPanel: {
      root: {
        boxShadow: "none",
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: muiTheme.spacing(0, 1.9),
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: muiTheme.spacing(1),
      },
    },
  },
});
