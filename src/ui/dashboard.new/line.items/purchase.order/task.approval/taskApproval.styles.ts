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
  approvalButton: {
    display: 'none',
  },
  innerWrap: {
    display: 'inline-flex',
  },
  rejectButton: {
    display: 'none',
  },
  gridWeb: {
    display: 'flex',
    justifyContent: 'center',
    background: Colors.background_white,
  },
  buttoncursor: {
    paddingLeft: 1,
  },
  [theme.breakpoints.down('xs')]: {
    poActionIconsWidth: {
      display: 'none',
    },
    nonPoActionIconsWidth: {
      display: 'none',
    },
    innerWrap: {
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
    cursorPointer: {
      marginRight: 8,
    },
  },
}));
