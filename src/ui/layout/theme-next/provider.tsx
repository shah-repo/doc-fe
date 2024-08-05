import { createTheme, Theme as MuiTheme, ThemeProvider } from '@material-ui/core';
import isMobile from 'is-mobile';
import * as React from 'react';
import { shape, spacing } from './consts';
import overrides from './overrides';
import palette from './palete';
import props from './props';
import shadows from './shadows';
import typography from './typography';

const baseTheme = createTheme({
  palette,
  shadows,
  typography,
  spacing,
  shape,
});

export interface NextTheme extends MuiTheme {
  media: {
    mobile: string
  }
}

export const themeNext = createTheme(
  {
    ...baseTheme,
    overrides: overrides(baseTheme),
    props: props(baseTheme),
  },
  {
    media: {
      mobile: baseTheme.breakpoints.down(isMobile() ? 'sm' : 'xs'),
    },
  },
) as NextTheme;

const Theme: React.FC = ({
  children,
}) => (
  <ThemeProvider theme={themeNext}>
    {/* TODO Add ScopedCssBaseline here after upgrading MUI */}
    {children}
  </ThemeProvider>
);

export default Theme;
