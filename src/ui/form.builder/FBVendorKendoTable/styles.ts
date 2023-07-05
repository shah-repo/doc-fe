import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

const ROW_HEIGHT = 40;
export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& td': {
      height: ROW_HEIGHT,
      boxSizing: 'border-box',
    },
  },
  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${Colors.dodger_blue}`,
    outlineOffset: -1,
  },
  chip: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 3,
    border: `1px solid ${Colors.steel_blue}`,
    background: Colors.light_cyan,
    fontWeight: 600,
    fontSize: 10,
    lineHeight: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.lochmara,
    cursor: 'pointer',
  },
  GREEN_STATUS: {
    background: Colors.carla,
    color: Colors.light_forest_green,
    border: `1px solid ${Colors.light_forest_green_border}`,
  },
  PENDING_STATUS: {
    background: Colors.old_lace,
    color: Colors.tawny,
    border: `1px solid ${Colors.ochre}`,
  },
  GRAY_STATUS: {
    background: Colors.lily_white,
    color: Colors.font_gray,
    border: `1px solid ${Colors.font_gray}`,
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
    zIndex: 3,
    right: 0,
    top: '100%',
  },
  actionsCell: {
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    width: '0 !important',
    padding: '0 !important',
    verticalAlign: 'bottom !important',
    borderLeft: `1px solid ${Colors.dodger_blue} !important`,
  },
  addButton: {
    float: 'right',
  },
  popperHolder: {
    height: '100%',
  },
  deleteIcon: {
    color: Colors.latest_red_varient,
  },
}));
