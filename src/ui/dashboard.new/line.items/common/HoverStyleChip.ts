import { Chip, withStyles } from '@material-ui/core';
import { TrainingStatus } from '../../../../state/ducks/dashboard/types';
import Colors from '../../../layout/theme/utils/colors';

const styles = () => ({
  root: {
    backgroundColor: (props) =>
      props.trainingStatus === TrainingStatus.OVERDUE
        ? Colors.latest_red_varient
        : Colors.latest_yellow_varient,
    borderRadius: '3px',
  },
  colorPrimary: {
    color: Colors.white,
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

export const HoverStyleChip = withStyles(styles)(Chip);
