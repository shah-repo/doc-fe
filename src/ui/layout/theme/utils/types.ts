import { Palette } from "@material-ui/core/styles/createPalette";
import { defaultPalette, demoPalette, devPalette, sandboxPalette } from "../palette";

export enum ThemeEnv {
  DEV_THEME = "DEV_THEME",
  DEMO_THEME = "DEMO_THEME",
  SANDBOX_THEME = "SANDBOX_THEME",
  PRODUCTION_THEME = "PRODUCTION_THEME",
}

export const ThemePalette: Record<ThemeEnv, Palette> = {
  DEV_THEME: devPalette,
  DEMO_THEME: demoPalette,
  PRODUCTION_THEME: defaultPalette,
  SANDBOX_THEME: sandboxPalette,
};
