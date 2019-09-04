import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import * as React from "react";
import theme from "./generator";

const Theme: React.FunctionComponent = ({
  children,
}) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default Theme;
