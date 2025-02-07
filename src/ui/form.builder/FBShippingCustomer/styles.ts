import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) =>
  createStyles({
    grid: {
      width: '100%',
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: Colors.textBlack,
    },
    shippingInfo: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: theme.spacing(3.75),
    },
    infoIcon: {
      marginRight: theme.spacing(1),
      cursor: 'pointer',
      height: 21,
      width: 21,
    },
  }),
);
