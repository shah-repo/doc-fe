import { makeStyles } from '@material-ui/core';
import { NextTheme } from '../../../layout/theme-next/provider';
import Colors from '../../../layout/theme/utils/colors';
import { grayDotStyles, lineItemStyles } from '../common/styles';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  innerWrap: {
    display: 'inline-flex',
  },
  [theme.media.mobile]: {
    innerWrap: {
      display: 'block',
    },
  },
  link: {
    borderRadius: '20px',
    padding: '6px 12px',
    color: Colors.white,
    backgroundColor: Colors.almost_black,
    fontSize: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: Colors.navy_active,
      textDecoration: 'none',
    },
  },
}));
