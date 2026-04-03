import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

const iconSize = {
  width: 17,
  height: 17,
};

export default makeStyles((theme) =>
  createStyles({
    attachmentHeader: {
      backgroundColor: Colors.athens_gray,
      color: Colors.almost_black,
      fontWeight: 600,
      fontSize: 12,
      display: 'flex',
      lineHeight: '15px',
      height: 44,
      boxShadow: `0 1px 0 ${Colors.chinese_silver}`,
      borderRadius: '3px 3px 0 0',
      border: `1px solid ${Colors.chinese_silver}`,
    },
    iconButton: {
      padding: theme.spacing(1, 1.5),
    },
    expandIcon: {
      ...iconSize,
      color: Colors.almost_black,
    },
    addIcon: {
      ...iconSize,
      color: Colors.almost_black,
    },
    addIconOutline: {
      ...iconSize,
      color: Colors.font_gray,
    },
    typeLabel: {
      color: Colors.almost_black,
      fontWeight: 600,
      fontSize: 12,
    },
  }),
);
