/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Box,
  Grid,
  Link,
  ListItemAvatar,
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
import { Nullable } from "../../../../../state/ducks/common/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import useAsync from "../../../../hooks/useAsync";
import useDialog from "../../../../hooks/useDialog";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import ApproveDialogueContainer from "./POApprovalDialogContainer";
import { styles } from "./taskApproval.styles";

interface Props {
  id: string;
  docDocumentId: string;
  type: string;
  docId: string;
  docRevId: string;
  approvalId: string;
  timestamp: string;
  docRevOwnerAvatar: Nullable<string>;
  docRevOwnerInitialColor: string;
  docRevOwnerName: string;
  docRevName: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pins: any;
  pinLineItem: (id: string) => void;
  unPinLineItem: (pinnedItemId: string) => void;

}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docId,
  approvalId,
  docRevId,
  docRevOwnerName,
  timestamp,
  docRevName,
  docRevOwnerAvatar,
  docRevOwnerInitialColor,
  hoverItemId,
  onMouseHoverItem,
  pins,
  pinLineItem,
  unPinLineItem,
}) => {
  const classes = styles();
  const [pinHover, setPinHover] = React.useState(false);
  const [approveHover, setApproveHover] = React.useState(false);
  const [rejectHover, setRejectHover] = React.useState(false);
  // const [pinned, setPinned] = React.useState(false);
  const pinned = pins && pins.length > 0;

  const [approved, setApproved] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const hoverItem = hoverItemId === id;

  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(pins[0].pinnedItemId);
  };
  const handleApproveClick = () => {
    openApproveDialog();
    setApproved(!approved);
  };
  const handleRejectClick = () => {
    openRejectDialog();
    setRejected(!rejected);
  };
  const onMouseLeaveActionIcons = () => {
    setApproveHover(false);
    setRejectHover(false);
    setPinHover(false);
  };
  const onMouseHoverPinIcon = () => {
    setApproveHover(false);
    setRejectHover(false);
    setPinHover(true);
  };
  const onMouseHoverApproveIcon = () => {
    setPinHover(false);
    setRejectHover(false);
    setApproveHover(true);
  };
  const onMouseHoverRejectIcon = () => {
    setPinHover(false);
    setApproveHover(false);
    setRejectHover(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
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

  return (
    <>
      <StyledListItem button onMouseEnter={onMouseHoverListItem}>
        <ListItemAvatar>
          <Avatar
            style={{ backgroundColor: `${docRevOwnerInitialColor}` }}
            className={classes.avatar}
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
                    className={`${classes.typographyBold} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {docRevOwnerName}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="require.approval" />
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Link
                    href={docId ? documentVersionPath(docRevId || "", docDocumentId) : "#"}
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typography} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      {docId}
                    </Typography>
                  </Link>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={docRevName ? documentVersionPath(docRevId || "", docDocumentId) : "#"}
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      noWrap
                    >
                      {docRevName}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot}></Grid>
                <Grid item={true} md={12} sm={12}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
                  >
                    {timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </>
          }
        />
        {hoverItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span>
              {!rejectHover && (
                <RejectIcon onMouseEnter={onMouseHoverRejectIcon} />
              )}
              {rejectHover && (
                <StyleTooltip title="Reject" placement="top" arrow>
                  <RejectSolidIcon
                    onClick={handleRejectClick}
                    onMouseLeave={onMouseLeaveActionIcons}
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
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              { !pinned && !pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
              { !pinned && pinHover && (
                <StyleTooltip title="Pin item" placement="top" arrow>
                  <PinSolidIcon
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
              {pinned && (
                <StyleTooltip title="Un Pin item" placement="top" arrow>
                  <PinSolidIcon
                    onClick={handleUnPinClick}
                  />
                </StyleTooltip>
              )}
            </span>
          </Box>
        )}
      </StyledListItem>
      <ApproveDialogueContainer
        transition="reject"
        approvalId={approvalId}
        transitionDialog={transitionDialog1}
        label="transition.action.reject"
      />
      <ApproveDialogueContainer
        transition="approve"
        approvalId={approvalId}
        transitionDialog={transitionDialog}
        label="transition.action.approve"
      />
    </>
  );
};

export default taskApprovalPresenter;
