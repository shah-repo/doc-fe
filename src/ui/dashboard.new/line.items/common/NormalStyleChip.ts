import { Chip, withStyles } from '@material-ui/core';
import { TrainingStatus } from '../../../../state/ducks/dashboard/types';
import Colors from '../../../layout/theme/utils/colors';

const styles = () => ({
  root: {
    'backgroundColor': Colors.white,
    'borderRadius': '3px',
    'font-weight': 'bold',
    'fontSize': '12px',
    'lineHeight': '15px',
  },
  colorPrimary: {
    color: (props) =>
      props.trainingStatus === TrainingStatus.OVERDUE
        ? Colors.latest_red_varient
        : Colors.latest_yellow_varient,
  },
  iconSmall: {
    height: '14px',
    width: '13px',
  },
  labelSmall: {
    'fontSize': '12px',
    'fontWeight': 700,
    'text-transform': 'uppercase',
  },
});

export const NormalStyleChip = withStyles(styles)(Chip);
