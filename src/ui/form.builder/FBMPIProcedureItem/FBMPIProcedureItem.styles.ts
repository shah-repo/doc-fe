import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles(() =>
  createStyles({
    attachmentHeader: {
      backgroundColor: Colors.athens_gray,
      color: Colors.almost_black,
      fontWeight: 600,
      fontSize: '12px',
      display: 'flex',
      lineHeight: '15px',
      height: '44px',
      boxShadow: `0 1px 0 ${Colors.chinese_silver}`,
      borderRadius: '3px 3px 0 0',
      border: `1px solid ${Colors.chinese_silver}`,
    },
    iconButton: {
      padding: '8px 12px',
    },
    expandIcon: {
      color: Colors.almost_black,
      width: '17px',
      height: '17px',
    },
    addIcon: {
      color: Colors.almost_black,
      width: '17px',
      height: '17px',
    },
    addIconOutline: {
      color: Colors.font_gray,
      width: '17px',
      height: '17px',
    },
    typeLabel: {
      color: Colors.almost_black,
      fontWeight: 600,
      fontSize: '12px',
    },
  }),
);
