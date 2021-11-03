/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Box,
  Grid, ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApproveIcon } from "../../../../../assets/images/approve.svg";
import { ReactComponent as ApproveSolidIcon } from "../../../../../assets/images/approve_solid.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_solid.svg";
import { ChangeRequestTransitionResponse } from "../../../../../state/ducks/changeRequest/types";
import useAsync from "../../../../hooks/useAsync";
import useDialog from "../../../../hooks/useDialog";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import ApproveDialogueContainer from "../dialogs/approveDialogueContainer";
// import { documentVersionPath } from "../../../../document.revision/utils/paths";
import { styles } from "./taskApproval.styles";

interface Props {
  id: string;
  type: string;
  arId?: string | undefined;
  docRevId?: string | undefined;
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
  docRevId,
  docRevOwnerName,
  timestamp,
  title,
  docRevOwnerAvatar,
  hoverItemId,
  onMouseHoverItem,
}) => {
  const classes = styles();
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
    <>
      <StyledListItem button onMouseEnter={onMouseHoverItemListItem}>
        <ListItemAvatar>
          <Avatar
            alt={docRevOwnerName}
            src={docRevOwnerAvatar ? docRevOwnerAvatar : "."}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
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
                    needs your approval for&nbsp;
                  </Typography>
                </Grid>
                <Grid item={true}>
                  {/* TO DO:: Needs to uncomment once we get document revision id in the response */}
                  {/* <Link
                    href={documentVersionPath(docRevId || "", id)}
                    color="inherit"
                    className={classes.link}
                  > */}
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {arId}
                  </Typography>
                  {/* </Link> */}
                    &nbsp;
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  {/* TO DO:: Needs to uncomment once we get document revision id in the response */}
                  {/* <Link
                    href={documentVersionPath(docRevId || "", id)}
                    color="inherit"
                    className={classes.link}
                  > */}
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {title}
                  </Typography>
                  {/* </Link> */}
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
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
                    &nbsp;{timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </>
          }
        />
        {hoverItem && (
          <Box component="div" className={classes.actionIcons}>
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
          </Box>
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
    </>
  );
};

export default taskApprovalPresenter;
