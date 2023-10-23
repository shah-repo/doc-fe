import { makeStyles } from '@material-ui/core';
import { grayDotStyles, lineItemStyles } from '../../common/styles';
import { NextTheme } from '../../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  innerLotRelease: {
    display: 'flex',
  },
  innerRelease: {
    flexWrap: 'initial',
  },
  [theme.media.mobile]: {
    innerLotRelease: {
      display: 'block',
    },
    innerRelease: {
      flexWrap: 'wrap',
    },
  },
}));
