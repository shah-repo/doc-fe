import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

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
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullScreen: {
    height: '100%',
  },
  dialogContentStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
  error: {
    color: Colors.error,
    fontSize: 12,
  },
}));
