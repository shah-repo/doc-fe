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
    listStyle: {
      padding: 0,
      background: Colors.whitest_grey,
    },
    listItemBtn: {
      padding: theme.spacing(1, 1.875, 1, 3.125),
      borderTop: 'none',
      borderBottom: `1px solid ${Colors.lightest_grey3}`,
      gap: '5px',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    listItemIcon: {
      minWidth: 0,
    },
    scoreChip: {
      backgroundColor: Colors.dodger_blue,
      borderRadius: '4px',
      height: 'fit-content',
      '& .MuiChip-label': {
        fontSize: 10,
        fontWeight: 500,
        lineHeight: '12.6px',
        padding: theme.spacing(0.375),
        paddingTop: theme.spacing(0.5),
      },
    },
    listItemText: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.25,
      color: Colors.almost_black,
    },
    list: {
      maxHeight: '655px',
      flexGrow: 1,
      overflowY: 'auto',
      padding: 0,
      borderBottom: `1px solid ${Colors.gray_goose}`,
      borderTop: `1px solid ${Colors.gray_goose}`,
    },
  }),
);
