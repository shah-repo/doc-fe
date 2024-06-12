import { StepConnector, makeStyles, withStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export const StepperConnector = withStyles({
  active: {
    '& $line': {
      backgroundColor: Colors.textBlack,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: Colors.success,
    },
  },
  line: {
    backgroundColor: Colors.textBlack,
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
      color: Colors.textDisabled,
      fill: 'transparent',
      border: `2px solid ${Colors.textDisabled}`,
      borderRadius: '50%',
      fontWeight: '700',
      '& text': {
        fill: Colors.textDisabled,
      },
      '&.MuiStepIcon-active': {
        color: Colors.textBlack,
        fill: Colors.textBlack,
        border: 'none',
        borderRadius: 0,
        '& text': {
          fill: 'white',
        },
      },
      '&.MuiStepIcon-completed': {
        color: Colors.success,
        fill: Colors.success,
        border: 'none',
        borderRadius: 0,
      },
    },
    '& .MuiStepLabel-label': {
      color: Colors.textDisabled,
      fontSize: 12,
      fontWeight: '400',
      '&.MuiStepLabel-active': {
        color: Colors.textBlack,
      },
      '&.MuiStepLabel-completed': {
        color: Colors.textBlack,
      },
    },
  },
}));
