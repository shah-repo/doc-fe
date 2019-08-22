import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0066FF",
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
    text: {
      hint: "#B4C0CA",
      primary: "#4d4d4d",
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
        fontFamily: "Open Sans, sans-serif;",
      },
      subtitle1: {
        color: "#4d4d4d",
        fontSize: "0.8rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      subtitle2: {
        subtitle1: {
          color: "#4d4d4d",
          fontSize: "0.875rem",
          fontFamily: "Open Sans, sans-serif;",
        },
      },
      h5: {
        color: "#4d4d4d",
        fontSize: "1.1rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      h4: {
        color: "#4d4d4d",
        ontSize: "1.4rem",
      },
      h6: {
        fontWeight: "normal",
        fontFamily: "Open Sans, sans-serif;",
      },
    },
    MuiButton: {
      root: {
        fontSize: "0.75rem",
        borderRadius: 0,
        margin: defaultTheme.spacing(1),
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
    MuiSelect: {
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
    MuiListItemText: {
      primary: {
        fontSize: "0.9rem",
        color: "#4d4d4d",
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
