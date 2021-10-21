/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import { withStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as ApproveIcon } from "../../../../../assets/images/approve.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject.svg";
import Colors from "../../../../layout/theme/utils/colors";
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
  id,
  title,
  requestedBy,
  verbose,
  timestamp,
}) => {
  const classes = styles();
  const [pinned, setPinned] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);

  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  const handlePinClick = () => {
    console.log("Pin Clicked");
    setPinned(!pinned);
    console.log("Pinned:: ", !pinned);
  };
  const handleApproveClick = () => {
    console.log("Approve Clicked");
    setApproved(!approved);
    console.log("Approved:: ", !approved);
  };
  const handleRejectClick = () => {
    console.log("Reject Clicked");
    setRejected(!rejected);
    console.log("Rejected:: ", !rejected);
  };
  const onMouseHoverItem = () => {
    setHoverItem(true);
  };
  const onMouseLeaveItem = () => {
    setHoverItem(false);
  };
  // eslint-disable-next-line no-console
  console.log("Task Approval Presenter ::::");
  return (
    <StyledListItem
      button
      onMouseEnter={onMouseHoverItem}
      onMouseLeave={onMouseLeaveItem}
    >
      <ListItemAvatar className={classes.listItemIcon}>
        <Avatar alt={requestedBy} src="." />
      </ListItemAvatar>
      <ListItemText
        primary={
          <React.Fragment>
            <Grid container={true}>
              <Grid item={true} md={12} sm={12}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  <b>{requestedBy}</b> &nbsp;
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {verbose} {id}
                </Typography>{" "}
                &nbsp;
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  <b>{title}</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container={true}>
              <Grid item={true} md={12} sm={12}>
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
        }
      />
      {hoverItem && (
        <div className={classes.actionIcons}>
          <span>
            <RejectIcon onClick={handleRejectClick} />
          </span>
          <span className={classes.actionIcon}>
            <ApproveIcon onClick={handleApproveClick} />
          </span>
          <span className={classes.actionIcon}>
            <PinIcon onClick={handlePinClick} />
          </span>
        </div>
      )}
    </StyledListItem>
  );
};

export default taskApprovalPresenter;
