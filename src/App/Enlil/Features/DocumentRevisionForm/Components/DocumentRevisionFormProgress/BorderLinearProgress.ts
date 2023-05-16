import { LinearProgress, withStyles } from '@material-ui/core';
import Colors from '../../../../../../ui/layout/theme/utils/colors';

export const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    borderRadius: '10px',
  },
  colorPrimary: {
    backgroundColor: Colors.light_athens_gray,
  },
  barColorPrimary: {
    borderRadius: '10px 0px 0px 10px',
    background:
    `linear-gradient(262.45deg, ${Colors.cerulean} 0.28%, ${Colors.ultramarine_blue} 45.54%, ${Colors.navy} 85.48%)`,
  },
}))(LinearProgress);
