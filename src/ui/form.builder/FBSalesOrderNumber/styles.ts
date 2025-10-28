import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) =>
  createStyles({
    grid: {
      width: '100%',
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: Colors.textBlack,
    },
  }),
);
