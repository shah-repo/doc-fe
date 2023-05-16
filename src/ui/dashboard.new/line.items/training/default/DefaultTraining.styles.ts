import { makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme: Theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  typographyDueInfewDays: {
    fontWeight: 'bold',
    fontSize: 13,
    color: Colors.latest_yellow_varient,
    letterSpacing: 0,
  },
  typographyOverdue: {
    fontWeight: 'bold',
    fontSize: 13,
    color: Colors.latest_red_varient,
    letterSpacing: 0,
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
