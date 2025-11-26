import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(() =>
  createStyles({
    textContainer: {
      color: Colors.textBlack,
      fontWeight: 600,
      fontSize: 12,
    },
  }),
);
