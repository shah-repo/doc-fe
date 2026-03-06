import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
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
    infoIcon: {
      color: Colors.dodger_blue,
      fontSize: 14,
      opacity: 0.9,
    },
    dropdownParentContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      overflow: 'visible',
      width: '100%',
    },
    infoIconContainer: {
      display: 'flex',
      marginLeft: theme.spacing(1),
      pointerEvents: 'auto',
    },
    infoMessageWrapper: {
      whiteSpace: 'pre-line',
    },
  }),
);
