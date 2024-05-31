import { StepConnector, makeStyles, withStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const StepperConnector = withStyles({
  active: {
    '& $line': {
      backgroundColor: Colors.almost_black,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: Colors.green_blue,
    },
  },
  line: {
    backgroundColor: Colors.almost_black,
  },
})(StepConnector);

export default makeStyles(theme => ({
  container: {
    maxWidth: 800,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  customStepper: {
    backgroundColor: 'transparent',
  },
  step: {
    '& .MuiStepIcon-root': {
      color: '#9A9FAB',
      fill: 'transparent',
      border: '2px solid #9A9FAB',
      borderRadius: '50%',
      fontWeight: '700',
      '& text': {
        fill: '#9A9FAB',
      },
      '&.MuiStepIcon-active': {
        color: Colors.almost_black,
        fill: Colors.almost_black,
        border: 'none',
        borderRadius: 0,
        '& text': {
          fill: 'white',
        },
      },
      '&.MuiStepIcon-completed': {
        color: Colors.green_blue,
        fill: Colors.green_blue,
        border: 'none',
        borderRadius: 0,
      },
    },
    '& .MuiStepLabel-label': {
      color: '#9A9FAB',
      fontSize: 12,
      fontWeight: '400',
      '&.MuiStepLabel-active': {
        color: Colors.almost_black,
      },
      '&.MuiStepLabel-completed': {
        color: Colors.almost_black,
      },
    },
  },
}));
