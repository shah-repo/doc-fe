import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Config from "../../../config";
import { WhiteLabelingColors } from "../../../state/ducks/company/types";
import ThemeOverrides from "./overrides";
import { createAppPalette, muiTheme } from "./palette";
import { ThemeEnv } from "./utils/types";

export const createAppTheme = (customColors: WhiteLabelingColors) => createMuiTheme({
  ...muiTheme,
  palette: createAppPalette(Config.Theme as ThemeEnv, customColors),
});

export default (customColors: WhiteLabelingColors = {} as WhiteLabelingColors) => {
  const appTheme = createAppTheme(customColors);

  return createMuiTheme({
    ...appTheme,
    overrides: ThemeOverrides(appTheme, customColors),
  });
};
