import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Config from '../../../config';
import { WhiteLabelingColors } from '../../../state/ducks/company/types';
import themeProps from './props';
import themeOverrides from './overrides';
import { createAppPalette, muiTheme } from './palette';
import { ThemeEnv } from './utils/types';
import { themeNext, NextTheme } from '../theme-next/provider';

const createAppTheme = (customColors: WhiteLabelingColors) => createMuiTheme(
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

  return createMuiTheme({
    ...appTheme,
    props: themeProps(),
    overrides: themeOverrides(appTheme, customColors),
    typography: {
      fontFamily: 'Sora, sans-serif;',
    },
  });
};
