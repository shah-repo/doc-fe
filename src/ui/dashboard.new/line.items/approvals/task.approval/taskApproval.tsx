/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ApproveIcon } from "../../../../../assets/images/approve.svg";
import { ReactComponent as ApproveSolidIcon } from "../../../../../assets/images/approve_solid.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_solid.svg";
import { changeRequestEditPath } from "../../../../change.request/utils/paths";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./taskApproval.styles";
interface Props {
  id: string;
  type: string;
  arId: string | undefined;
  timestamp: string | undefined;
  docRevOwnerAvatar?: string | undefined | null;
  docRevOwnerName: string | undefined;
  title: string | undefined;
}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id,
  arId,
  docRevOwnerName,
  timestamp,
  title,
  docRevOwnerAvatar,
}) => {
  const classes = styles();
  id = "02358497-19c6-412f-8ac4-cff69fefcd50";

  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  const StyleTooltip = withStyles({
    arrow: {
      color: Colors.black,
    },
    tooltip: {
      backgroundColor: Colors.black,
    },
    tooltipPlacementTop: {
      margin: "8px 0",
    },
  })(Tooltip);

  const [pinHover, setPinHover] = React.useState(false);
  const [approveHover, setApproveHover] = React.useState(false);
  const [rejectHover, setRejectHover] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);

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
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const onMouseHoverApproveIcon = () => {
    setApproveHover(true);
  };
  const onMouseLeaveApproveIcon = () => {
    setApproveHover(false);
  };
  const onMouseHoverRejectIcon = () => {
    setRejectHover(true);
  };
  const onMouseLeaveRejectIcon = () => {
    setRejectHover(false);
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
        <Avatar
          alt={docRevOwnerName}
          src={docRevOwnerAvatar ? docRevOwnerAvatar : "."}
        />
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
                  <b>{docRevOwnerName}</b> &nbsp;
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  needs approval for
                </Typography>{" "}
                &nbsp;
                <Link to={changeRequestEditPath(id)} style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                  >
                    {arId}&nbsp;
                  </Typography>
                </Link>
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
            {!rejectHover && (
              <RejectIcon onMouseEnter={onMouseHoverRejectIcon} />
            )}
            {rejectHover && (
              <StyleTooltip title="Reject" placement="top" arrow>
                <RejectSolidIcon
                  onClick={handleRejectClick}
                  onMouseLeave={onMouseLeaveRejectIcon}
                />
              </StyleTooltip>
            )}
          </span>
          <span className={classes.actionIcon}>
            {!approveHover && (
              <ApproveIcon onMouseEnter={onMouseHoverApproveIcon} />
            )}
            {approveHover && (
              <StyleTooltip title="Approve" placement="top" arrow>
                <ApproveSolidIcon
                  onClick={handleApproveClick}
                  onMouseLeave={onMouseLeaveApproveIcon}
                />
              </StyleTooltip>
            )}
          </span>
          <span className={classes.actionIcon}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip title="Pin item" placement="top" arrow>
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
          </span>
        </div>
      )}
    </StyledListItem>
  );
};

export default taskApprovalPresenter;
