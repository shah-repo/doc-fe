import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles(() =>
  createStyles({
    title: {
      fontWeight: 600,
      fontSize: 18,
      color: Colors.almost_black,
      textTransform: 'capitalize',
    },
  }),
);
