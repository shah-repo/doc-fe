import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme-next/colors';
import { grayDotStyles, lineItemStyles } from '../../common/styles';
import { NextTheme } from '../../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  closeButton: {
    display: 'none',
  },
  closeAlign: {
    textAlign: 'center',
  },
  [theme.media.mobile]: {
    closeButton: {
      borderRadius: 10,
      background: Colors.textGray,
      color: Colors.gray,
      display: 'inline-flex',
      width: '50%',
    },
    actionIcons: {
      display: 'none',
    },
    cursorPointer: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(0.3),
    },
  },
}));
