import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const headerBackgroundStyles = makeStyles(() =>
  createStyles({
    GREEN_STATUS: {
      backgroundColor: Colors.green_blue,
    },
    RED_STATUS: {
      backgroundColor: Colors.latest_red_varient,
    },
    CLOSED_STATUS: {
      backgroundColor: Colors.dawn,
    },
    PENDING_STATUS: {
      backgroundColor: Colors.school_bus_yellow,
    },
    GRAY_STATUS: {
      backgroundColor: Colors.mandy,
    },
    WIP_STATUS: {
      backgroundColor: Colors.dodger_blue,
    },
    undefined: {
      backgroundColor: Colors.dodger_blue,
    },
  },
  ));
