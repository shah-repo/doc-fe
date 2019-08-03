import { CssBaseline  } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
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
        background: "#f5f5f5",
      },
      root: {
        boxShadow: "none",
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
