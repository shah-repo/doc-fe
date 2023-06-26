import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../../../../ui/layout/theme/utils/colors';

export default makeStyles((theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    collapseRoot: {
      padding: theme.spacing(2),
      background: Colors.whitest_grey,
      borderBottom: `1px solid ${Colors.lightest_grey1}`,
    },
    outerBox: {
      background: Colors.whitest_grey,
    },
    listStyle: {
      padding: 0,
      background: Colors.whitest_grey,
    },
    listItemBtn: {
      padding: theme.spacing(0, 1.25, 0, 2),
      height: 50,
      borderTop: 'none',
      borderBottom: `1px solid ${Colors.lightest_grey1}`,
    },
    listItemStyle: {
      height: 48,
      background: Colors.white,
      border: `1px solid ${Colors.lightest_grey1}`,
      borderRadius: 3,
      marginBottom: 10,
    },
    listItemText: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.25,
      display: 'flex',
      textTransform: 'uppercase',
      color: Colors.almost_black,
    },
    listSubItem: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.25,
      letterSpacing: 0,
      marginLeft: 3,
      color: Colors.almost_black,
      cursor: 'pointer',
    },
    searchBox: {
      padding: theme.spacing(2.5, 0),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: {
      flexGrow: 1,
      overflowY: 'auto',
      padding: 0,
    },
    iconBtn: {
      marginLeft: 3,
    },
  }),
);
