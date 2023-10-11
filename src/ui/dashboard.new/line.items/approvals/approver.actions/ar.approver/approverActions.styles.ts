import { makeStyles } from '@material-ui/core';
import { grayDotStyles, lineItemStyles } from '../../../common/styles';

export default makeStyles((theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  innerWrap: {
    display: 'inline-flex',
  },
  truncateMobile: {
    overFlow: 'unset',
  },
  [theme.breakpoints.down('xs')]: {
    innerWrap: {
      display: 'block',
    },
    truncateMobile: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      wordBreak: 'break-all',
    },
  },
}));
