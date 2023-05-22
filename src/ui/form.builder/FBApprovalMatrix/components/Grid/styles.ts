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
    cellARHeader: {
      '& .k-link': {
        justifyContent: 'center',
      },
      '& .k-column-title': {
        whiteSpace: 'normal',
        textAlign: 'center',
      },
    },
    cellAR: {
      textAlign: 'center !important' as 'center',
    },
    clearRightBorder: {
      borderRight: 'none !important',
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
    actions: {
      width: 60,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1.25),
      backgroundColor: Colors.primaryLight,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      position: 'absolute',
      zIndex: 3,
      right: 0,
      top: '100%',
    },
    actionButton: {
      minWidth: 25,
      minHeight: 25,
      backgroundColor: Colors.white,
      borderRadius: 6,
      padding: theme.spacing(0.6),
      border: 'none !important',
    },
    iconButton: {
      fontSize: 16,
      color: Colors.textGray,
      '&:hover': {
        color: Colors.primary,
      },
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
    buttonFullscreen: {
      marginLeft: 'auto',
    },
  };
});
