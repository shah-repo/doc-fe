import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles(() =>
  createStyles({
    link: {
      color: Colors.black,
    },
    buttoncursor: {
      cursor: 'unset',
    },
    truncateText: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      paddingTop: '1px',
      marginLeft: '5px',
      marginRight: '5px',
    },
    ml5: {
      marginLeft: '5px',
    },
    mr5: {
      marginRight: '5px',
    },
    typography: {
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: 0,
    },
    typographyBold: {
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
    },
    timestampContainer: {
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '22px',
      color: Colors.font_gray,
      letterSpacing: 0,
    },
    blackDot: {
      width: '4px',
      height: '4px',
      right: '4px',
      position: 'relative',
      background: Colors.black,
    },
  })
);
