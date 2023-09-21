import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) =>
  createStyles({
    box: {
      maxHeight: 350,
      padding: 0,
      overflow: 'auto',
    },
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
      background: Colors.water,
      cursor: 'default',
      '&:hover': {
        background: Colors.water,
      },
    },
    viewIcon: {
      color: Colors.almost_black,
      cursor: 'pointer',
      height: 14,
      width: 14,
    },
    viewIconContainer: {
      padding: 0,
    },
  }),
);
