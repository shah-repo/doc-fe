import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

const ROW_HEIGHT = 40;
export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
    },
    '& td': {
      height: ROW_HEIGHT,
      boxSizing: 'border-box',

      '& a': {
        color: Colors.textBlack,

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
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,

    '& td': {
      verticalAlign: 'top !important',
      whiteSpace: 'normal !important' as 'normal',
    },
  },
  actionsCell: {
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    width: '0 !important',
    padding: '0 !important',
    verticalAlign: 'bottom !important',

    '& > div': {
      borderLeft: `1px solid ${Colors.primaryLight} !important`,
    },
  },
  addButton: {
    float: 'right',
  },
  tooltipContent: {
    maxWidth: 425,
    maxHeight: 200,
    overflow: 'auto',
    whiteSpace: 'pre-line',
    paddingRight: theme.spacing(0.5),
    marginRight: theme.spacing(-0.5),
  },
}));
