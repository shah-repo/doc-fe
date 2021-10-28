/* eslint-disable react-hooks/rules-of-hooks */
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
import Link from "@material-ui/core/Link";
import React from "react";
import { ReactComponent as ApproveIcon } from "../../../../../assets/images/approve.svg";
import { ReactComponent as ApproveSolidIcon } from "../../../../../assets/images/approve_solid.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_solid.svg";
import { ChangeRequestTransitionResponse } from "../../../../../state/ducks/changeRequest/types";
import { changeRequestEditPath } from "../../../../change.request/utils/paths";
import useAsync from "../../../../hooks/useAsync";
import useDialog from "../../../../hooks/useDialog";
import Colors from "../../../../layout/theme/utils/colors";
import ApproveDialogueContainer from "../dialogs/approveDialogueContainer";
import { styles } from "./taskApproval.styles";

interface Props {
  id: string;
  type: string;
  arId?: string | undefined;
  arStatus?: string | undefined;
  timestamp: string | undefined;
  docRevOwnerAvatar?: string | undefined | null;
  docRevOwnerName: string | undefined;
  title?: string | undefined;
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id,
  arId,
  docRevOwnerName,
  timestamp,
  title,
  docRevOwnerAvatar,
  hoverItemId,
  onMouseHoverItem,
}) => {
  const classes = styles();
  id = "02358497-19c6-412f-8ac4-cff69fefcd50"; // TO DO: needs to be removed after getting proper API response

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
  const hoverItem = hoverItemId === arId;

  const handlePinClick = () => {
    setPinned(!pinned);
  };
  const handleApproveClick = () => {
    openApproveDialog();
    setApproved(!approved);
  };
  const handleRejectClick = () => {
    openRejectDialog();
    setRejected(!rejected);
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
  const transitionDialog = useDialog();
  const transitionDialog1 = useDialog();
  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      transitionDialog.close();
    },
    onError: (error) => {
      transitionDialog.close();
    },
  });

  const openApproveDialog = () => {
    async.reset();
    transitionDialog.open();
  };
  const openRejectDialog = () => {
    async.reset();
    transitionDialog1.open();
  };
  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(arId);
  };

  return (
    <React.Fragment>
      <StyledListItem
        button
        onMouseEnter={onMouseHoverItemListItem}
      >
        <ListItemAvatar>
          <Avatar
            alt={docRevOwnerName}
            src={docRevOwnerAvatar ? docRevOwnerAvatar : "."}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid container={true} wrap="nowrap" justify="flex-start" alignItems="center">
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {docRevOwnerName} &nbsp;
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                  needs approval for&nbsp;
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className= {classes.link}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.typography}
                      color="textPrimary"
                      noWrap
                    >
                      {arId}
                    </Typography>&nbsp;
                  </Link>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className= {classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      noWrap
                    >
                      {title}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid container={true} wrap="nowrap" justify="flex-start" alignItems="center">
            &nbsp;&nbsp;
                <Grid item={true} className={classes.grayDot}>
                &nbsp;
                </Grid>
                <Grid item={true} md={12} sm={12}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
                  >
                  &nbsp; {timestamp}
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
      <ApproveDialogueContainer
        transition="reject"
        changeRequestId={id}
        transitionDialog={transitionDialog1}
        label="transition.action.reject"
      />
      <ApproveDialogueContainer
        transition="approve"
        changeRequestId={id}
        transitionDialog={transitionDialog}
        label="transition.action.approve"
      />
    </React.Fragment>
  );
};

export default taskApprovalPresenter;
