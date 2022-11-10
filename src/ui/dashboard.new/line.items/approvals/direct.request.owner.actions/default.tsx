import { Box, Grid, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import Colors from "../../../../layout/theme/utils/colors";
import { getDocIcon, getStatusLabel } from "../../common/DocIcon";
import DocId from "../../common/DocId/presenter";
import DocTitle from "../../common/DocTitle/presenter";
import { HoverStyleChip } from "../../common/HoverStyleChipApprovalApproved";
import { NormalStyleChip } from "../../common/NormalStyleChipApprovalApproved";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import { DocTypeGroups } from "../../common/types";
import useStyles from "./default.styles";
import DismissAction from "../../common/DismissAction";

interface Props {
  id: string;
  docTypeGroup: DocTypeGroups;
  docDocumentId: string;
  docId: string;
  docRevId?: string;
  type: string;
  docRevName: string;
  docRevVersion: string;
  status: string;
  displaystatus: string;
  timestamp: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
  dismissLineItem?: (id: string) => void;
}
const DirectRequestOwnerActionItemsPresenter: React.FC<Props> = ({
  id,
  docTypeGroup,
  docDocumentId,
  docId,
  docRevId,
  status,
  displaystatus,
  docRevName,
  docRevVersion,
  timestamp,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
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
      <ListItemIcon>{getDocIcon(docTypeGroup)}</ListItemIcon>
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
                <DocId url={documentVersionPath(docRevId || "", docDocumentId)} docId={docId} />
              </Grid>
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <DocTitle
                  url={documentVersionPath(docRevId || "", docDocumentId)}
                  docRevVersion={docRevVersion}
                  docRevName={docRevName}
                />
              </Grid>
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="body2"
                  className={`${classes.typography} ${classes.margin5}`}
                  color="textPrimary"
                  noWrap
                >
                  <Text translation="common.is" />
                </Typography>
              </Grid>
              {STATUS_TYPES_LABEL.APPROVED === status ||
                  (STATUS_TYPES_LABEL.RELEASED === status && (
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
                            icon={<ApprovedIcon />}
                            label={
                              getStatusLabel(docTypeGroup, status, displaystatus)
                            }
                          />
                        )}
                        {hoverItem && (
                          <HoverStyleChip
                            color="primary"
                            size="small"
                            icon={<ApprovedWhiteIcon />}
                            label={
                              getStatusLabel(docTypeGroup, status, displaystatus)
                            }
                          />
                        )}
                      </Typography>
                    </Grid>
                  ))}
              {STATUS_TYPES_LABEL.APPROVED !== status &&
                  STATUS_TYPES_LABEL.RELEASED !== status && (
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {docTypeGroup === DocTypeGroups.PI_INSTANCE
                      ? displaystatus
                      : status}
                  </Typography>
                </Grid>
              )}
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
        <Box component="div" className={classes.actionIcons}>
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
        </Box>
      )}
      {pinned && (
        <span className={classes.actionIcon}>
          <StyleTooltip
            title={<Text translation="common.unpin" />}
            placement="top"
            arrow
          >
            <PinSolidIcon onClick={handleUnPinClick} className={classes.cursorPointer} />
          </StyleTooltip>
        </span>
      )}
      {hoverItem && dismissLineItem && (
        <DismissAction classes={classes} onClick={handleDismiss} />
      )}
    </StyledListItem>
  );
};

export default DirectRequestOwnerActionItemsPresenter;
