import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { ThemeEnv } from "../../../../config/types";

export type ThemeEnvType = {
  [key in ThemeEnv]: () => Theme;
};
