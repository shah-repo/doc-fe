import { createMuiTheme } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";

export const muiTheme = createMuiTheme();

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
    default: "#f0f0f0",
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
    ...defaultPalette.secondary,
    dark: "#FFCA00",
    main: "#EBBA00",
    contrastText: "#29064C",
    light: "#0066FF",
  },
};

export const demoPalette: Palette = {
  ...defaultPalette,
  secondary: {
    ...defaultPalette.secondary,
    dark: "#C42260",
    main: "#D52568",
  },
};
