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
  approvalButton: {
    display: 'none',
  },
  rejectButton: {
    display: 'none',
  },
  innerWrap: {
    display: 'inline-flex',
  },
  gridWeb: {
    display: 'flex',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('xs')]: {
    actionIcons: {
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
