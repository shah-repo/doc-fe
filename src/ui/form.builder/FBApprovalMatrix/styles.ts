import { makeStyles } from '@material-ui/core';

export default makeStyles(() => ({
  buttonFullscreen: {
    marginLeft: 'auto',
  },
  clearRightBorder: {
    borderRight: 'none !important',
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
}));
