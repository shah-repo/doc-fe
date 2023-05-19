import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    rootContainer: {
      height: '52px',
      background: Colors.whitest_grey,
      borderRadius: '100px',
      margin: '0 15px',
    },
    toggleButtonGroup: {
      position: 'absolute',
    },
    button: {
      'textTransform': 'none',
      'position': 'absolute',
      'fontFamily': 'Sora',
      'fontWeight': 'bold',
      'fontSize': '14px',
      'top': '5px',
      'height': '42px',
      '&:hover': {
        background: 'transparent',
        borderRadius: '100px',
      },
    },
    config: {
      width: '143px',
      left: '5px',
    },
    validation: {
      width: '105px',
      left: '160px',
    },
    active: {
      'color': Colors.navy,
      'borderRadius': '100px',
      'boxShadow': '0 2px 5px rgba(204, 212, 217, 0.8)',
      'background': Colors.white,
      '&:hover': {
        background: Colors.white,
      },
    },
    inactive: {
      border: 0,
      color: Colors.font_gray,
    },
    titleContainerText: {
      display: 'flex',
      alignItems: 'center',
      height: '50px',
      background: Colors.white,
      boxShadow: `0 1px 0 ${Colors.chinese_silver}`,
      width: '299px',
      marginTop: '20px',
    },
    staticTitleText: {
      fontSize: '16px',
      margin: '0 10px',
      fontWeight: 700,
      display: 'flex',
      color: Colors.almost_black,
    },
    titleText: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '15px',
      textTransform: 'uppercase',
      color: Colors.almost_black,
      cursor: 'pointer',
    },
  })
);
