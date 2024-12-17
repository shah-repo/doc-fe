import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) =>
  createStyles({
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: Colors.textBlack,
    },
    shippingInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
    },
    fieldContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    shippingInfoContainer: {
      display: 'flex',
      background: Colors.primaryBg,
      padding: '15px',
      gap: '10px',
      marginLeft: theme.spacing(3.75),
      borderRadius: '7px',
    },
    shippingInfoCard: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
    },
    cardHeading: {
      color: Colors.textBlack,
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '20px',
    },
    cardInfo: {
      color: Colors.textBlack,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '20px',
    },
    cardEmail: {
      color: Colors.primary,
    },
  }),
);
