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
      gap: theme.spacing(3.75),
    },
    fieldContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1.25),
    },
    shippingInfoContainer: {
      display: 'flex',
      background: Colors.primaryBg,
      padding: theme.spacing(1.875),
      gap: theme.spacing(1.25),
      marginLeft: theme.spacing(3.75),
      borderRadius: theme.spacing(0.875),
    },
    shippingInfoCard: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.375),
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
