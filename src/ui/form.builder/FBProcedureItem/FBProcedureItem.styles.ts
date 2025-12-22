import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles({
  attachmentBox: {
    borderTop: 1,
    borderRight: 1,
    borderLeft: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerBox: {
    backgroundColor: Colors.gray,
    fontWeight: 600,
    display: 'flex',
    borderBottom: '1px solid',
  },
});
