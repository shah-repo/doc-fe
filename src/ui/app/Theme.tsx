import { createMuiTheme, CssBaseline, MuiThemeProvider } from "@material-ui/core";
import * as React from "react";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
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
