import { makeStyles } from '@material-ui/core';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  poActionIconsWidth: {
    width: 146,
  },
  nonPoActionIconsWidth: {
    width: 112,
  },
}));
