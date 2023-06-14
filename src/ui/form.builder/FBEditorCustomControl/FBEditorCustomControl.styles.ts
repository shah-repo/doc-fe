import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles(() =>
  createStyles({
    listSubItem: {
      fontFamily: 'Sora',
      fontSize: '14px',
      fontWeight: 400,
      marginLeft: '6px',
      textTransform: 'capitalize',
      color: Colors.almost_black,
      cursor: 'pointer',
    },
    listItemStyle: {
      'height': '48px',
      'width': '269px',
      'background': Colors.white,
      'border': `1px solid ${Colors.lightest_grey1}`,
      'borderRadius': '3px',
      'marginBottom': '10px',
      '& $lastItem': {
        marginBottom: 0,
      },
    },
  }),
);
