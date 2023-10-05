import { makeStyles } from '@material-ui/core';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  textPoReviewlapMobile: {
    flexWrap: 'nowrap',
  },
  [theme.breakpoints.down('xs')]: {
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
