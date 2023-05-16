import { Chip, withStyles } from '@material-ui/core';
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
    color: Colors.latest_blue_varient,
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
