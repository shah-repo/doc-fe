import { createStyles, Theme } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';

export default (theme: Theme) =>
  createStyles({
    headerButton: {
      'alignItems': 'baseline',
      'width': '100%',
      'boxShadow': 'none',
      'textTransform': 'none',
      'padding': 0,
      'margin': 0,
      '&:hover': {
        background: 'none',
        boxShadow: 'none',
      },
    },
    bottomPush: {
      paddingTop: 8,
      marginRight: 20,
      marginLeft: 4,
    },
    emailPosition: {
      flexFlow: 'nowrap',
      display: 'flex',
      position: 'relative',
      width: '100%',
    },
    emailStyle: {
      fontWeight: 'normal',
      fontSize: '11px',
      lineHeight: '14px',
      color: Colors.white,
    },
    nameStyle: {
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: '15px',
      color: Colors.white,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '8rem',
    },
  });
