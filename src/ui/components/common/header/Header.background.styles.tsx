import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const headerBackgroundStyles = makeStyles(() =>
  createStyles({
    GREEN_STATUS: {
      background: Colors.green_blue,
    },
    RED_STATUS: {
      background: Colors.latest_red_varient,
    },
    CLOSED_STATUS: {
      background: Colors.dawn,
    },
    PENDING_STATUS: {
      background: Colors.school_bus_yellow,
    },
    GRAY_STATUS: {
      background: Colors.mandy,
    },
    WIP_STATUS: {
      background: Colors.dodger_blue,
    },
    undefined: {
      background: Colors.dodger_blue,
    },
  },
  ));
