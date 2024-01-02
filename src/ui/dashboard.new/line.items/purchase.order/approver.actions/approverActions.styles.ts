import { makeStyles } from '@material-ui/core';
import { NextTheme } from '../../../../layout/theme-next/provider';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  truncateMobile: {
    overFlow: 'unset',
  },
  [theme.media.mobile]: {
    truncateMobile: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      wordBreak: 'break-all',
    },
  },
}));
