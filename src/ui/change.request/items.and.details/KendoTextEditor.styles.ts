import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(() =>
  createStyles({
    marginBStyle: {
      '& p':
      { marginBottom: '0px' },
    },
    error: {
      color: Colors.error,
    },
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 4,
      'line-clamp': 4,
      '-webkit-box-orient': 'vertical',
    },
  }),
);
