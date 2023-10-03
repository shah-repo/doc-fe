import { makeStyles } from '@material-ui/core';
import { grayDotStyles, lineItemStyles } from '../../../common/styles';

export default makeStyles((theme) => ({
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
  [theme.breakpoints.down('xs')]: {
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
