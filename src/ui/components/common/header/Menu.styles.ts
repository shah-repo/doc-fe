import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles(() =>
  createStyles({
    iconButton: {
      color: Colors.white,
      marginRight: '20px',
    },
    menu: {
      padding: '5px 0px',
      boxSizing: 'border-box',
      boxShadow: '0px 10px 30px rgba(22, 34, 41, 0.15)',
      borderRadius: '4px',
    },
    menuItem: {
      backgroundColor: Colors.white,
      margin: '0px',
      padding: '0px',
      width: '240px',
    },
  }));
