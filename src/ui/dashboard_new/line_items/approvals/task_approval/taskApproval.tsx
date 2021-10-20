import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { styles } from "./taskApproval.styles";

interface Props {
  // pendingAction: any;
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  approvers: string[];
  verbose: string;
  requestedBy: string;
}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id, title, requestedBy, verbose, timestamp,
}) => {
  const classes = styles();
  // eslint-disable-next-line no-console
  console.log("task Approval Presenter :::;");
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          JS
        </Avatar>
      </ListItemAvatar>
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
                <b>{requestedBy}</b>
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                {verbose} {id}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              ><b>{title}</b>
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

export default taskApprovalPresenter;
