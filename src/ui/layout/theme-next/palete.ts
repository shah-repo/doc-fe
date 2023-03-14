import { PaletteType } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import Colors from "./colors";

const palette = (): PaletteOptions => ({
  type: "light" as PaletteType,
  common: {
    black: Colors.black,
    white: Colors.white,
  },
  primary: {
    main: Colors.primary,
    light: Colors.primaryLight,
    dark: Colors.primaryDark,
    contrastText: Colors.white,
  },
  secondary: {
    main: Colors.secondary,
    light: Colors.secondary,
    dark: Colors.secondary,
    contrastText: Colors.white,
  },
  error: {
    main: Colors.error,
    light: Colors.error,
    dark: Colors.error,
  },
  text: {
    primary: Colors.textBlack,
    secondary: Colors.textGray,
    disabled: Colors.textDisabled,
    hint: Colors.textGray,
  },
  divider: Colors.stroke,
  background: {
    paper: Colors.white,
    default: Colors.background,
  },
  action: {
    active: Colors.textGray,
    hover: Colors.hover,
    selected: Colors.primaryHighlight,
    disabled: Colors.textDisabled,
    disabledBackground: Colors.buttonDisabled,
  },
  grey: {
    50: Colors.gray,
    100: Colors.fieldDisabled,
    200: Colors.stroke,
    300: Colors.buttonDisabled,
    400: Colors.statusClosed,
    500: Colors.textDisabled,
    600: Colors.textGray,
    700: Colors.textBlack,
    A100: Colors.tableHeader,
    A200: Colors.primaryHighlight,
    A400: Colors.tableStroke,
    A700: Colors.navigationBg,
  },
});

export default palette();
