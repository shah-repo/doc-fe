import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme) => ({
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
  [theme.breakpoints.down('xs')]: {
    closeButton: {
      borderRadius: 10,
      background: Colors.font_gray,
      color: Colors.white_smoke,
      display: 'inline-flex',
      width: '50%',
    },
    actionIcons: {
      display: 'none',
    },
    cursorPointer: {
      marginRight: 8,
      marginBottom: 3,
    },
  },
}));
