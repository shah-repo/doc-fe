import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

const ROW_HEIGHT = 40;

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  toolbarContainer: {
    height: 24,
  },
  disabled: {
    pointerEvents: 'none',
  },
  exportExcelIcon: {
    color: Colors.almost_black,
    paddingRight: theme.spacing(1.25),
    width: 14,
    height: 14,
    cursor: 'pointer',
  },
  grid: {
    '& .k-grid-container': {
      borderBottomLeftRadius: '0 !important',
      borderBottomRightRadius: '0 !important',
    },

    '& .k-column-title': {
      fontSize: 10,
      textTransform: 'uppercase',
      whiteSpace: 'normal',
    },

    '& td': {
      height: ROW_HEIGHT,
      boxSizing: 'border-box',
      '& a': {
        color: Colors.almost_black,
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',

    '& .k-grid-container': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  updatingRow: {
    position: 'relative',
    outline: `1px solid ${Colors.dodger_blue}`,
    zIndex: 2,
    outlineOffset: -1,
    borderRadius: 'unset',
    '& td': {
      whiteSpace: 'normal !important' as 'normal',
    },
    '& td:last-child': {
      borderLeft: `1px solid ${Colors.dodger_blue} !important`,
    },
  },
  actionsCell: {
    width: 0,
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    padding: '0 !important',
  },
  addButton: {
    float: 'right',
  },
  popperHolder: {
    height: '100%',
  },
  tooltipContent: {
    maxWidth: 425,
    maxHeight: 200,
    overflow: 'auto',
    whiteSpace: 'pre-line',
    paddingRight: theme.spacing(0.5),
    marginRight: theme.spacing(-0.5),
  },
  actions: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25),
    backgroundColor: Colors.dodger_blue,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  deleteIcon: {
    color: Colors.latest_red_varient,
  },
  addPartButton: {
    marginTop: -4,
  },
  owner: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    fontSize: 12,
    fontWeight: 600,
    color: Colors.white,
    fontFamily: 'Sora',
    textTransform: 'uppercase',
    marginRight: theme.spacing(0.875),
    display: 'inline-block',
    padding: theme.spacing(1, 0, 0, 0.6),
  },
  userName: {
    fontFamily: 'Sora',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: '18px',
    color: Colors.almost_black,
  },
}));
