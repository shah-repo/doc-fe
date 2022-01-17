import { Chip, withStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";
import { TrainingStatus } from "../../../../state/ducks/dashboard/types";

const styles = () => ({
  root: {
    backgroundColor: (props) =>
      props.trainingStatus === TrainingStatus.OVERDUE
        ? Colors.latest_red_varient
        : Colors.latest_yellow_varient,
    borderRadius: "3px",
  },
  colorPrimary: {
    color: Colors.white,
  },
});

export const HoverStyleChip = withStyles(styles)(Chip);
