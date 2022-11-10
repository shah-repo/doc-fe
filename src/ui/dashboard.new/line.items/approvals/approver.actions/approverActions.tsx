import { Avatar, Grid, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_status.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject_status_solid.svg";
import { Nullable } from "../../../../../state/ducks/common/types";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { getInitalsFromName } from "../../../../components/icons/avatar/helpers";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import Colors from "../../../../layout/theme/utils/colors";
import DocId from "../../common/DocId/presenter";
import DocTitle from "../../common/DocTitle/presenter";
import { HoverStyleChip } from "../../common/HoverStyleChipApprovalApproved";
import { HoverStyleChip as RejectedHoverStyleChip } from "../../common/HoverStyleChipApprovalRejected";
import { NormalStyleChip } from "../../common/NormalStyleChipApprovalApproved";
import { NormalStyleChip as RejectedNormalStyleChip } from "../../common/NormalStyleChipApprovalRejected";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import useStyles from "./approverActions.styles";
import DismissAction from "../../common/DismissAction";

interface Props {
  id: string;
  docDocumentId: string;
  docId: string;
  docRevId?: string;
  type: string;
  docRevName: string;
  docRevVersion: string;
  status: string;
  timestamp: string;
  approverName: string;
  approverAvatar: Nullable<string>;
  approverInitialColor: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
  dismissLineItem?: (id: string) => void;
}
const ApproverActionItemPresenter: React.FC<Props> = ({
  id,
  docDocumentId,
  docId,
  docRevId,
  status,
  docRevName,
  docRevVersion,
  approverName,
  approverAvatar,
  approverInitialColor,
  timestamp,
  hoverItemId,
  onMouseHoverItem,
  unPinLineItem,
  pinLineItem,
  pinned,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [pinHover, setPinHover] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(id);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  return (
    <StyledListItem
      button
      divider
      disableRipple
      className={classes.buttoncursor}
      style={hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
      onMouseEnter={onMouseHoverListItem}
    >
      <ListItemAvatar>
        {approverAvatar ? (
          <Avatar
            style={{ backgroundColor: `${approverInitialColor}` }}
            className={classes.avatar}
            alt={approverName}
            src={approverAvatar}
          />
        ) : (
          <Avatar
            style={{ backgroundColor: `${approverInitialColor}` }}
            className={classes.avatar}
          >
            {getInitalsFromName(approverName)}
          </Avatar>
        )}
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
                  {approverName}
                </Typography>
              </Grid>
              {STATUS_TYPES_LABEL.REJECTED === status && (
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && (
                      <RejectedNormalStyleChip
                        size="small"
                        color="primary"
                        icon={<RejectIcon data-cy="transition-reject" />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                    {hoverItem && (
                      <RejectedHoverStyleChip
                        color="primary"
                        size="small"
                        icon={<RejectSolidIcon data-cy="transition-reject" />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                  </Typography>
                </Grid>
              )}
              {STATUS_TYPES_LABEL.APPROVED === status && (
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<ApprovedIcon data-cy="transition-approve" />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                    {hoverItem && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={
                          <ApprovedWhiteIcon data-cy="transition-approve" />
                        }
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                  </Typography>
                </Grid>
              )}
              {STATUS_TYPES_LABEL.APPROVED !== status &&
                  STATUS_TYPES_LABEL.REJECTED !== status && (
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {status}
                  </Typography>
                </Grid>
              )}
              {/* <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="common.your" />
                  </Typography>
                </Grid> */}
              <Grid item={true}>
                <DocId url={documentVersionPath(docRevId || "", docDocumentId)} docId= {docId}/>
              </Grid>
              {/* {docRevName && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.typography}
                      color="textPrimary"
                      noWrap
                    >
                      <Text translation="common.to" />
                    </Typography>
                  </Grid>
                )} */}
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <DocTitle
                  url={documentVersionPath(docRevId || "", docDocumentId)}
                  docRevVersion={docRevVersion} docRevName={docRevName}
                />
              </Grid>
            </Grid>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true} className={classes.grayDot}></Grid>
              <Grid item={true}>
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
      {hoverItem && !pinned && (
        <div className={classes.actionIcons}>
          {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} className={classes.cursorPointer} />}
          {pinHover && (
            <StyleTooltip
              title={<Text translation="common.pin" />}
              placement="top"
              arrow
            >
              <PinSolidIcon
                onClick={handlePinClick}
                onMouseLeave={onMouseLeavePinIcon}
                className={classes.cursorPointer}
              />
            </StyleTooltip>
          )}
          {dismissLineItem && (
            <DismissAction classes={classes} onClick={handleDismiss} />
          )}
        </div>
      )}
      {pinned && (
        <span className={classes.actionIcon}>
          <StyleTooltip
            title={<Text translation="common.unpin" />}
            placement="top"
            arrow
          >
            <PinSolidIcon onClick={handleUnPinClick} className={classes.cursorPointer}/>
          </StyleTooltip>
        </span>
      )}
      {hoverItem && dismissLineItem && (
        <DismissAction classes={classes} onClick={handleDismiss} />
      )}
    </StyledListItem>
  );
};

export default ApproverActionItemPresenter;
