import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/myfeeds_overdue.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/myfeeds_warning.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./pendingTraining.styles";
interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  verbose: string;
  dueDate: string;
}
const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id, title, status, timestamp, dueDate,
}) => {
  const classes = styles();
  const StyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
    },
    colorPrimary: {
      color: status === "OVERDUE" ? Colors.red : Colors.latest_yellow_varient,
    },
  })(Chip);
  // eslint-disable-next-line no-console
  console.log("Pending Training Presenter ::");
  return (
    <ListItem button>
      <ListItemIcon>
        <TrainingIcon />
      </ListItemIcon>
      <ListItemText primary= {
        <React.Fragment>
          <Grid container={true}>
            <Grid item={true} md={12} sm={12} >
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                 Your Training {status === "OVERDUE"  ? "" : "On"} {id} {title} is
              </Typography>&nbsp;
              <Typography
                component="span"
                variant="body2"
                className={status === "OVERDUE"  ? classes.typographyOverdue : classes.typographyDueInfewDays}
              >
                <StyleChip size="small" icon={status === "OVERDUE" ? <OverdueIcon /> : <WarningIcon />}
                  color="primary" label={status}/>
                  . {dueDate}
              </Typography>
            </Grid>
          </Grid>
          <Grid container={true} >
            <Grid item={true} md={12} sm={12} >
              <Typography
                component="span"
                variant="caption"
                className={classes.timestampContainer}
                color="textSecondary"
              >
                . {timestamp}
              </Typography>
            </Grid>
          </Grid>
        </React.Fragment>
      } />

    </ListItem>
  );
};

export default PendingTrainingPresenter;
