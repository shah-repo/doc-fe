import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginRight: 5,
  }),
  actionIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 1.25),
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    background: 'none',
  },
  typographyDueInfewDays: {
    fontWeight: 'bold',
    fontSize: 13,
    color: Colors.latest_yellow_varient,
  },
  typographyOverdue: {
    fontWeight: 'bold',
    fontSize: 13,
    color: Colors.latest_red_varient,
    letterSpacing: 0,
  },
  marginRight: {
    marginRight: theme.spacing(2.25),
  },
  redDot: {
    width: 4,
    height: 4,
    right: 4,
    position: 'relative',
    background: Colors.latest_red_varient,
  },
  yellowDot: {
    width: 4,
    height: 4,
    right: 4,
    position: 'relative',
    background: Colors.latest_yellow_varient,
  },
}));
