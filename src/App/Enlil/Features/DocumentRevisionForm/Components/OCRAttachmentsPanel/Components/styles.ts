import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../../ui/layout/theme-next';

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
      background: Colors.fieldDisabled,
    },
    listItemBtn: {
      padding: theme.spacing(1, 1.875, 1, 3.125),
      borderTop: 'none',
      borderBottom: `1px solid ${Colors.tableStroke}`,
      gap: '5px',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    listItemIcon: {
      minWidth: 0,
    },
    scoreChip: {
      backgroundColor: Colors.primaryLight,
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
      color: Colors.textBlack,
    },
    list: {
      flexGrow: 1,
      overflowY: 'auto',
      padding: 0,
      borderBottom: `1px solid ${Colors.lightGray3}`,
      borderTop: `1px solid ${Colors.lightGray3}`,
    },
  }),
);
