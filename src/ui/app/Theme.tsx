import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import Config, { PRODUCTION_THEME, DEMO_THEME, DEV_THEME } from "../../config";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import { productionEnvThemeOptions, demoEnvThemeOptions, devEnvThemeOptions } from "../common/themeConfiguration";

const getEnvThemeOptions = (env: string = DEV_THEME): ThemeOptions => {
  switch (env) {
    case PRODUCTION_THEME:
      return productionEnvThemeOptions;
    case DEMO_THEME:
      return demoEnvThemeOptions;
    case DEV_THEME:
    default:
      return devEnvThemeOptions;
  }
}

const theme = createMuiTheme(getEnvThemeOptions(Config.Theme));

const Theme: React.FunctionComponent = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default Theme;
