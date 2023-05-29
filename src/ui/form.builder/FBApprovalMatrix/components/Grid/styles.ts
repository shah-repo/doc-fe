import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme) => {
  const cellVerticalPadding = theme.spacing(1.25);
  const cellHorizontalPadding = theme.spacing(2);

  return {
    updating: {
      position: 'relative',
      zIndex: 3,
      '& td:first-child': {
        borderLeft: `1px solid ${Colors.primaryLight} !important`,
        paddingLeft: `${cellHorizontalPadding - 1}px !important`,
      },
      '& td': {
        borderTop: `1px solid ${Colors.primaryLight} !important`,
        borderBottom: `1px solid ${Colors.primaryLight} !important`,
        paddingTop: `${cellVerticalPadding - 1}px !important`,
      },
    },
    inactive: {
      '& td': {
        color: `${Colors.textDisabled} !important`,
        backgroundColor: `${Colors.gray} !important`,
      },
      '&:hover td': {
        backgroundColor: `${Colors.darkGray} !important`,
      },
    },
    save: {
      position: 'relative',
    },
    discard: {
      position: 'relative',
    },
    grid: {
      '& .k-grid-container': {
        maxHeight: 300, // @todo
      },
      '& .k-column-title': {
        fontSize: 12,
        textTransform: 'uppercase',
      },
      '& .k-master-row': {
        '& td': {
          padding: `${cellVerticalPadding}px ${cellHorizontalPadding}px`,
        },
      },
      '& .k-filtercell': {
        '& .k-dropdown-wrap, & input': {
          border: 'none',
        },
      },
      '& .k-checkbox': {
        borderWidth: 1,
      },
    },
    gridWithButton: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottom: 'none',
    },
    buttonAdd: {
      width: '100%',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    actionsTd: {
      width: 0,
      overflow: 'visible !important',
      position: 'sticky',
      right: 0,
      padding: '0 !important',
    },
    // @todo: make via borderRight.
    line: {
      width: 1,
      backgroundColor: Colors.primaryLight,
      height: '100%',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 3,
    },
  };
});
