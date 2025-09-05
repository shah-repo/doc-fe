import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../../layout/theme-next';

export default makeStyles({
  option: {
    fontSize: 14,
    overflowWrap: 'anywhere',
  },
  expired: {
    color: Colors.errorHighlight,
  },
});
