import createTheme from '@material-ui/core/styles/createTheme';
import Config from '../../../config';
import { WhiteLabelingColors } from '../../../state/ducks/company/types';
import { NextTheme, themeNext } from '../theme-next/provider';
import themeOverrides from './overrides';
import { createAppPalette, muiTheme } from './palette';
import themeProps from './props';
import { ThemeEnv } from './utils/types';

const createAppTheme = (customColors: WhiteLabelingColors) => createTheme(
  {
    ...muiTheme,
    palette: createAppPalette(Config.Theme as ThemeEnv, customColors),
  },
  {
    media: themeNext.media,
  },
) as NextTheme;

export default (customColors: WhiteLabelingColors = {} as WhiteLabelingColors) => {
  const appTheme = createAppTheme(customColors);

  return createTheme({
    ...appTheme,
    props: themeProps(),
    overrides: themeOverrides(appTheme, customColors),
    typography: {
      fontFamily: 'Sora, sans-serif;',
    },
  });
};
