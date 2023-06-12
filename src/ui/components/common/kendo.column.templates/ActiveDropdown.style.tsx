import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    topButton: {
      display: 'flex',
      alignItems: 'center',
    },
    dot: {
      height: theme.spacing(0.75),
      width: theme.spacing(0.75),
      borderRadius: '50%',
    },
    Active: {
      background: Colors.latest_green_varient,
    },
    Inactive: {
      background: Colors.grey_cloud,
    },
    value: {
      margin: theme.spacing(0.625),
    },
  })
);
