import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Config from "../../../config";
import ThemeOverrides from "./overrides";
import { muiTheme } from "./palette";
import { ThemeEnv, ThemePalette } from "./utils/types";

export const appTheme = createMuiTheme({
  ...muiTheme,
  palette: ThemePalette[Config.Theme as ThemeEnv],
});

export default createMuiTheme({
  ...appTheme,
  overrides: ThemeOverrides(appTheme),
});
