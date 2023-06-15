import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles(() =>
  createStyles({
    columnsCus: {
      fontWeight: 600,
      fontSize: '14px',
      color: Colors.almost_black,
    },
    menuItem: {
      fontSize: '12px',
      fontWeight: 400,
      color: Colors.almost_black,
    },
    headerMenuItem: {
      'background': Colors.water,
      'cursor': 'default',
      '&:hover': {
        background: Colors.water,
      },
    },
  }),
);
