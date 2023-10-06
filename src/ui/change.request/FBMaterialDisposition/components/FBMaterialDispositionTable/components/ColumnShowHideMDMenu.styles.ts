import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../../layout/theme/utils/colors';

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
      width: '250px',
      background: Colors.water,
      cursor: 'default',
      '&:hover': {
        background: Colors.water,
      },
    },
    box: {
      maxHeight: 350,
      padding: 0,
      overflow: 'auto',
    },
    viewIcon: {
      color: Colors.almost_black,
      cursor: 'pointer',
      height: 14,
      width: 14,
    },
  }),
);
