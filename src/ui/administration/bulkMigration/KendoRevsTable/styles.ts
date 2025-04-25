import { lighten, makeStyles } from '@material-ui/core';
import { Colors as NextColors } from '../../../layout/theme-next';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  rootRevsList: {
    '& .k-grid-container tbody td': {
      height: 52,
      padding: theme.spacing(1, 1.75),
      verticalAlign: 'middle !important',
    },
    '& .k-grid-header thead th': {
      textTransform: 'uppercase',
      color: Colors.almost_black,
    },

  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  revsTablePopoverPaper: {
    padding: theme.spacing(1),
  },
  selectedRow: {
    backgroundColor: Colors.selected,
  },
  errMsgStyle: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: theme.spacing(0.5),
  },
  revsTableSelectedHighlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  revsTableRefreshBox: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    fontSize: 12,
  },
  revsTableActionableBox: {
    display: 'flex',
    alignItems: 'center',
  },
  revsTableRefreshText: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
  },
  revsTableRefreshIcon: {
    cursor: 'pointer',
    marginLeft: theme.spacing(0.5),
    fontSize: 18,
  },
  mappingSwitcher: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginRight: theme.spacing(0),
    '& span': {
      fontSize: '12px',
      fontWeight: 600,
    },
  },
  switchBase: {
    color: NextColors.statusDraftBorder,
    '&$checked': {
      color: NextColors.statusDraftBorder,
    },
  },
}));
