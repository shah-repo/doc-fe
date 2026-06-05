import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const useStyles = makeStyles({
  '@global': {
    '.MuiPickersToolbar-toolbar': {
      backgroundColor: Colors.dodger_blue,
    },
    '.MuiPickersDay-daySelected': {
      backgroundColor: Colors.dodger_blue,
      '&:hover': {
        backgroundColor: Colors.dodger_blue,
      },
    },
    '.MuiPickersDay-current': {
      color: Colors.dodger_blue,
    },
    '.MuiPickersDay-daySelected.MuiPickersDay-current': {
      color: Colors.white,
    },
    '.MuiPickersYear-yearSelected': {
      color: Colors.dodger_blue,
    },
    '.MuiPickersMonth-monthSelected': {
      color: Colors.dodger_blue,
    },
  },
});
