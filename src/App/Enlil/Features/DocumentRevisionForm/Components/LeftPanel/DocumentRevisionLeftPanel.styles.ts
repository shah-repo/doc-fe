import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../../../ui/layout/theme/utils/colors';

const DRAWER_WIDTH = 300;

export default makeStyles((theme) =>
  createStyles({
    root: {
      width: DRAWER_WIDTH,
      zIndex: 1202,
      height: '100%',
      backgroundColor: Colors.white,
      boxShadow: `inset -1px 0px 0px ${Colors.lightest_grey1}`,
      display: 'flex',
      flexDirection: 'column',
    },
    ocrView: {
      padding: theme.spacing(0.25, 1.875, 1.25, 3.12),
    },
    ocrTitle: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.dark_jungle_green,
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(0.5),
    },
    ocrSubTitle: {
      fontWeight: 400,
      fontSize: 12,
      color: Colors.font_gray,
    },
    titleText: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.dark_jungle_green,
    },
    list: {
      borderTop: `1px solid ${Colors.gray_goose}`,
      flexGrow: 1,
      overflow: 'hidden',
    },
  }),
);
