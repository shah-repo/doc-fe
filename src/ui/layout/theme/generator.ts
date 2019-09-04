import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Config from "../../../config";
import { ThemeEnv } from "../../../config/types";
import ThemeOverrides from "./overrides";
import { defaultPalette, demoPalette, devPalette, muiTheme } from "./palette";
import { ThemeEnvType } from "./utils/types";

const devTheme = () => createMuiTheme({
  ...muiTheme,
  palette: devPalette,
});

const demoTheme = () => createMuiTheme({
  ...muiTheme,
  palette: demoPalette,
});

const prodTheme = () => createMuiTheme({
  ...muiTheme,
  palette: defaultPalette,
});

export const ThemePalette: ThemeEnvType = {
  DEV_THEME: devTheme,
  DEMO_THEME: demoTheme,
  PRODUCTION_THEME: prodTheme,
};

export const appTheme = ThemePalette[Config.Theme as ThemeEnv]();

export default createMuiTheme({
  ...appTheme,
  overrides: ThemeOverrides(appTheme),
});
