import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as RecentSelectedIcon } from "../../../../../assets/images/recent_selected_myfeed_li.svg";
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
  approvers: string[];
}
const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id, title, status, verbose, timestamp, approvers,
}) => {
  const classes = styles();
  const StyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
    },
    colorPrimary: {
      color: Colors.latest_blue_varient,
    },
  })(Chip);
  // eslint-disable-next-line no-console
  console.log("Pending Training Presenter ::");
  return (
    <ListItem button>
      {/* <ListItemAvatar>
        <Avatar>
          <SendIcon />
        </Avatar>
      </ListItemAvatar> */}
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
                <b>{id} </b>
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                {title}lll
              </Typography>&nbsp;
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                <StyleChip size="small" icon={<RecentSelectedIcon />}
                  color="primary" label={status}/>
              </Typography>&nbsp;
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                {verbose}
              </Typography>
            </Grid>
          </Grid>
          <Grid container={true} >
            <Grid item={true} md={12} sm={12} >
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                {approvers.join(",")}
              </Typography>
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
