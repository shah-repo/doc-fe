import { Chip, withStyles } from "@material-ui/core";
import { TrainingStatus } from "../../../../../state/ducks/dashboard/types";
import Colors from "../../../../layout/theme/utils/colors";

const styles = () => ({
  root: {
    backgroundColor: Colors.white,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: (props) =>
      props.status === TrainingStatus.COMPLETED
        ? Colors.latest_green_varient
        : props.status === TrainingStatus.OVERDUE
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
  },
});

export const NormalStyleChip = withStyles(styles)(Chip);
