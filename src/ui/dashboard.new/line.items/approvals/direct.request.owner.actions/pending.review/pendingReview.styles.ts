import { makeStyles } from '@material-ui/core';
import { grayDotStyles, lineItemStyles } from '../../../common/styles';
import { NextTheme } from '../../../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  innerPedingReview: {
    display: 'flex',
  },
  innerReview: {
    flexWrap: 'initial',
  },
  [theme.media.mobile]: {
    innerPedingReview: {
      display: 'block',
    },
    innerReview: {
      flexWrap: 'wrap',
    },
    link: {
      pointerEvents: 'none',
    },
    margin7: {
      pointerEvents: 'none',
    },
  },
}));
