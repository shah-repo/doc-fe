import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";
import { TrainingStatus } from "../../../../state/ducks/dashboard/types";

const styles = () => ({
  root: {
    backgroundColor: Colors.white,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: (props) =>
      props.status === TrainingStatus.OVERDUE
        ? Colors.latest_red_varient
        : Colors.latest_yellow_varient,
  },
});

export const NormalStyleChip = withStyles(styles)(Chip);
