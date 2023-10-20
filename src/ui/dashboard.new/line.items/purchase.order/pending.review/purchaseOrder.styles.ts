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
  textPoReviewlapMobile: {
    flexWrap: 'nowrap',
  },
  [theme.custom.mobile]: {
    textPoReviewlapMobile: {
      flexWrap: 'wrap',
    },
    link: {
      pointerEvents: 'none',
    },
    actionIcons: {
      display: 'none',
    },
  },
}));
