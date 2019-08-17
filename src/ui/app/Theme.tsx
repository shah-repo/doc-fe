import { CssBaseline  } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { palette } from "@material-ui/system";
import * as React from "react";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#d12833",
      contrastText: "#fff",
    },
    secondary: {
      main: "#aeb8d6",
      contrastText: "#fff",
    },
    background: {
      default: "#f0f0f0",
      paper: "#fff",
    },
  },
  overrides: {
    MuiAppBar: {
      colorDefault: {
        background: "#fff",
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
        fontFamily: "Product Sans",
      },
      subtitle1: {
        color: "#4d4d4d",
        fontSize: "0.8rem",
      },
      subtitle2: {
        subtitle1: {
          color: "#4d4d4d",
          fontSize: "0.875rem",
        },
      },
      h5: {
        color: "#4d4d4d",
        fontSize: "1.1rem",
      },
      h4: {
        color: "#4d4d4d",
        ontSize: "1.4rem",
      },
    },
    MuiButton: {
      root: {
        fontSize: "0.7rem",
        borderRadius: 0,
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
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "0.8rem",
      },
    },
  },
});

const Theme: React.FunctionComponent = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default Theme;
