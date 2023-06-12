import { createStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export default () =>
  createStyles({
    modeltitle: {
      position: 'static',
      width: '194.98px',
      height: '18px',
      left: 'calc(50% - 194.98px/2 - 107.51px)',
      top: 'calc(50% - 18px/2)',
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '18px',
      display: 'flex',
      alignItems: 'center',
      color: Colors.almost_black,
    },
    closemodel: {
      left: '20.55%',
      right: '0%',
      bottom: '22.15%',
      fontSize: '1rem',
    },
    pendingBox: {
      flexDirection: 'column',
      height: 'auto',
      overflowY: 'auto',
      top: '48px',
      left: '20px',
      border: '1px solid',
      borderColor: Colors.sky_blue,
      display: 'flex',
      padding: '20px',
      backgroundColor: Colors.white,
      boxSizing: 'border-box',
      alignItems: 'flex-start',
      borderRadius: '8px',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '15px 20px',
      position: 'relative',
      top: '12.5%',
      background: Colors.sky_blue,
      borderRadius: '8px',
    },
    closedDialogueContent: {
      padding: 0,
    },
    submitButton: {
      'background': Colors.medium_blue,
      'color': Colors.white,
      'boxShadow': 'none',
      'margin': '0 10px 0 5px',
      'flexGrow': 1,
      '&:hover': {
        background: Colors.medium_blue,
      },
    },
    cancelButton: {
      'background': Colors.light_blue,
      'color': Colors.medium_blue,
      'boxShadow': 'none',
      'margin': '0 5px 0 10px',
      'flexGrow': 0.6,
      '&:hover': {
        background: Colors.light_blue,
      },
    },
    dialogAction: {
      display: 'flex',
      marginBottom: 10,
    },
    dialogContent: {
      color: Colors.dark_gray,
      opacity: 0.6,
    },
    iconContainer: {
      '&:before': {
        content: "''",
        height: 40,
        width: 45,
        position: 'absolute',
        backgroundColor: Colors.red,
        opacity: 0.1,
        color: Colors.light_red,
        transform: 'translate(-10px, -6px)',
        borderRadius: 11,
      },
    },
  });
