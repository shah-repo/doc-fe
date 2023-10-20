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
  typographyChildrenBold: {
    fontSize: 14,
    fontWeight: 700,
  },
}));
