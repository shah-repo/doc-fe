import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(() =>
  createStyles({
    marginBStyle: {
      '& p':
      { marginBottom: '0px' },
    },
    previewContent: {
      width: '100%',
      height: '100%',
    },
    previewPlaceholder: {
      color: Colors.lightGray3,
      padding: '4px 0',
    },
  }),
);
