import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../../../../../ui/layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    searchBox: {
      'display': 'flex',
      'height': '36px',
      'alignItems': 'center',
      'width': 270,
      'borderRadius': '100px',
      'border': `1px solid ${Colors.lightest_grey1}`,
      '& .MuiInputBase-root': {
        width: '220px',
      },
    },
    searchIcon: {
      marginLeft: '11px',
      marginBottom: '0px',
      marginRight: '2px',
    },
    searchInput: {
      position: 'static',
      height: '15px',
      left: '32px',
      top: '10.5px',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '15px',
      textAlign: 'right',
      textTransform: 'capitalize',
      color: Colors.font_gray,
    },
  })
);
