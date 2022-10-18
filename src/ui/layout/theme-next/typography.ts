import { TypographyOptions } from "@material-ui/core/styles/createTypography";

const typography = (): TypographyOptions => ({
  fontFamily: "Sora, sans-serif",
  htmlFontSize: 16,
  fontSize: 14,
  fontWeightBold: 700,
  fontWeightLight: 300,
  fontWeightMedium: 500,
  fontWeightRegular: 400,
  body1: {
    fontSize: ".875rem",
    lineHeight: 1.65,
  },
  body2: {
    fontSize: ".75rem",
    lineHeight: 1.65,
  },
  h1: {
    fontSize: "1.875rem",
    lineHeight: 1.25,
    fontWeight: 600,
  },
  h2: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 400,
  },
  h3: {
    fontSize: "1.25rem",
    lineHeight: 1.25,
    fontWeight: 400,
  },
  h4: {
    fontSize: "1rem",
    lineHeight: 1.25,
    fontWeight: 400,
  },
  h5: {
    fontSize: ".875rem",
    lineHeight: 1.25,
  },
  h6: {
    fontSize: ".75rem",
    lineHeight: 1.25,
  },
  subtitle1: {
    fontSize: ".875rem",
    lineHeight: 1.25,
  },
  subtitle2: {
    fontSize: ".75rem",
    lineHeight: 1.25,
  },
  caption: {
    fontSize: ".625rem",
    lineHeight: 1.25,
  },
  overline: {
    fontSize: ".625rem",
    lineHeight: 1.25,
  },
  button: {
    fontSize: ".75rem",
    lineHeight: 1.25,
    fontWeight: 600,
    textTransform: "none",
  },
});

export default typography();
