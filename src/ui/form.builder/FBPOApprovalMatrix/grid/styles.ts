import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& .k-filtercell': {
      '& .k-dropdown-wrap, & input': {
        border: 'none',
      },
    },
    '& .k-grid-header': {
      position: 'sticky',
      top: -28,
      zIndex: 4,
    },
    '& td': {
      padding: `${theme.spacing(1, 1.5)} !important`,
    },
    '& .k-grid-norecords': {
      display: 'none',
    },
  },
  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75, 0.75),
  },
  activeChip: {
    cursor: 'pointer',
  },
}));
