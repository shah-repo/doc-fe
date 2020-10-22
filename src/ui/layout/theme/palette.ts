import { createMuiTheme } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { WhiteLabelingColors } from "../../../state/ducks/company";
import { ThemeEnv } from "./utils/types";

export const muiTheme = createMuiTheme();

export const createAppPalette = (theme: ThemeEnv, customColors: WhiteLabelingColors) => {
  let palette;
  switch (theme) {
    case ThemeEnv.DEMO_THEME:
      palette = demoPalette;
      break;
    case ThemeEnv.DEV_THEME:
      palette = devPalette;
      break;
    case ThemeEnv.SANDBOX_THEME:
      palette = sandboxPalette;
      break;
    default:
      palette = defaultPalette;
      break;
  }

  palette = {
    ...palette,
    primary: {
      main: customColors.primary || palette.primary.main,
      contrastText: customColors.primaryContrastText || palette.primary.contrastText,
    },
    secondary: {
      main: customColors.secondary || palette.secondary.main,
      contrastText: customColors.secondaryContrastText || palette.secondary.contrastText,
    },
    background: {
      default: customColors.defaultBackground || palette.background.default,
    },
    tonalOffset: 0.4,
  };

  return palette;
};

export const defaultPalette: Palette = {
  ...muiTheme.palette,
  primary: {
    main: "#0066FF",
    contrastText: "#fff",
    light: "#dbe9ff",
    dark: "#003dcb",
  },
  secondary: {
    light: "#B3F9F5",
    dark: "#29064C",
    main: "#6E09EA",
    contrastText: "#fff",
  },
  background: {
    default: "#5C9DFF",
    paper: "#fff",
  },
  text: {
    hint: "#B4C0CA",
    primary: "#4d4d4d",
    secondary: "#252525",
    disabled: "#797979",
  },
};

export const devPalette: Palette = {
  ...defaultPalette,
  secondary: {
    // ...defaultPalette.secondary,
    dark: "#FFCA00",
    main: "#EBBA00",
    contrastText: "#29064C",
    light: "#0066FF",
  },
};

export const demoPalette: Palette = {
  ...defaultPalette,
  secondary: {
    // ...defaultPalette.secondary,
    dark: "#C42260",
    main: "#D52568",
  } as PaletteColor,
};

export const sandboxPalette: Palette = {
  ...defaultPalette,
  primary: {
    main: "#FF7600",
    contrastText: "#FFFFFF",
  } as PaletteColor,
  secondary: {
    main: "#FF7600",
    contrastText: "#FFFFFF",
  } as PaletteColor,
  background: {
    ...defaultPalette.background,
    default: "#5D666F",
  },
};
