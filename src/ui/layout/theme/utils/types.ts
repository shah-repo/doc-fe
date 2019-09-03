import { Palette } from "@material-ui/core/styles/createPalette";
import { ThemeEnv } from "../../../../config/types";

export type ThemePalleteType = {
  [key in ThemeEnv]: Palette;
};
