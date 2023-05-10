import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles({
  root: {
    position: 'absolute',
    inset: 0,
    backgroundColor: Colors.whiteDimmed,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});
