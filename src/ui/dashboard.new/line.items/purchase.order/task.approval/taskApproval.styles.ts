import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  poActionIconsWidth: {
    width: 146,
  },
  nonPoActionIconsWidth: {
    width: 112,
  },
  seemoreButton: {
    display: 'none',
  },
  approvalButton: {
    display: 'none',
  },
  innerwrap: {
    display: 'inline-flex',
  },
  rejectButton: {
    display: 'none',
  },
  gridWeb: {
    display: 'flex',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('xs')]: {
    poActionIconsWidth: {
      display: 'none',
    },
    innerwrap: {
      display: 'block',
    },
    rejectButton: {
      borderRadius: 25,
      background: Colors.latest_red_varient,
      color: Colors.white_smoke,
      display: 'inline-flex',
      paddingRight: 20,
    },
    approvalButton: {
      borderRadius: 25,
      background: Colors.latest_green_varient,
      color: Colors.white_smoke,
      display: 'inline-flex',
      paddingRight: 20,

    },
    nested: {
      borderLeft: 'none',
      marginLeft: 0,
    },
  },
}));
