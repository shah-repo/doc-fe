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
  ApprovalButton: {
    display: 'none',
  },
  innerwrap: {
    display: 'inline-flex',
  },
  RejectButton: {
    display: 'none',
  },
  DocIcon: {
    display: 'none',
  },

  [theme.breakpoints.down('xs')]: {
    poActionIconsWidth: {
      display: 'none',
    },
    innerwrap: {
      display: 'block',
    },
    RejectButton: {
      borderRadius: 25,
      background: Colors.latest_red_varient,
      color: Colors.white_smoke,
      display: 'inline-flex',
      paddingRight: 20,
    },
    ApprovalButton: {
      borderRadius: 25,
      background: Colors.latest_green_varient,
      color: Colors.white_smoke,
      display: 'inline-flex',
      paddingRight: 20,

    },
    DocIcon: {
      marginRight: 10,
      display: 'inline-flex',
    },
    nested: {
      borderLeft: 'none',
      marginLeft: 0,
    },
  },
}));
