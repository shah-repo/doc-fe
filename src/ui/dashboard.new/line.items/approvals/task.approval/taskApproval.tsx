import { Avatar, Box, Collapse, Grid, IconButton, List, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { ReactComponent as ApproveIcon } from '../../../../../assets/images/approve.svg';
import { ReactComponent as ApproveSolidIcon } from '../../../../../assets/images/approve_solid.svg';
import { ReactComponent as CollapseIcon } from '../../../../../assets/images/collapse.svg';
import { ReactComponent as ExpandIcon } from '../../../../../assets/images/expand.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as RejectIcon } from '../../../../../assets/images/reject.svg';
import { ReactComponent as RejectSolidIcon } from '../../../../../assets/images/reject_solid.svg';
import { ReactComponent as ViewIcon } from '../../../../../assets/images/view.svg';
import { ReactComponent as ViewSolidIcon } from '../../../../../assets/images/view_solid.svg';
import { Nullable } from '../../../../../state/ducks/common/types';
import { changeRequestEditPath } from '../../../../change.request/utils/paths';
import { getInitalsFromName } from '../../../../components/icons/avatar/helpers';
import Text from '../../../../components/Text';
import useDialog from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import ApprovalTitle from '../../common/ApprovalTitle/presenter';
import { getDocIcon } from '../../common/DocIcon';
import DocId from '../../common/DocId/presenter';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import { DocTypeGroups } from '../../common/types';
import ApproveDialogueContainer from '../../dialogs/approveDialogueContainer';
import useStyles from './taskApproval.styles';
import DismissAction from '../../common/DismissAction';

interface Props {
  id: string
  type: string
  arId: string
  docRevs: {
    docTypeGroup: DocTypeGroups
    documentRevisionId: string
    documentId: string
    docId: string
    displayRevision: string
    name: string
    justificationOfChange: string
    descriptionOfChange: string
  }[]
  arChangeRequestId: string
  timestamp: string
  docRevOwnerAvatar: Nullable<string>
  docRevOwnerInitialColor: string
  docRevOwnerName?: string
  title?: string
  hoverItemId: string
  onMouseHoverItem: (id: string) => void
  pinned: boolean
  pinLineItem?: (id: string) => void
  unPinLineItem?: (id: string) => void
  dismissLineItem?: (id: string) => void
}
const TaskApprovalPresenter: React.FC<Props> = ({
  id,
  arChangeRequestId,
  arId,
  docRevs,
  docRevOwnerName,
  timestamp,
  title,
  docRevOwnerAvatar,
  docRevOwnerInitialColor,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [pinHover, setPinHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState('');
  const [approveHover, setApproveHover] = React.useState(false);
  const [rejectHover, setRejectHover] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const handlePinClick = () => {
    pinLineItem?.(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem?.(id);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const onMouseHoverViewIcon = (id: string) => {
    setViewHoverItem(id);
  };
  const onMouseLeaveViewIcon = () => {
    setViewHoverItem('');
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
  const transitionDialogApprove = useDialog();
  const transitionDialogReject = useDialog();
  const handleApproveClick = transitionDialogApprove.open;
  const handleRejectClick = () => {
    transitionDialogReject.open();
  };

  const isPinShown = pinLineItem && !pinned;
  const isUnpinShown = unPinLineItem && pinned;

  return (
    <>
      <StyledListItem
        button
        divider
        disableRipple
        className={classes.listItem}
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        onMouseEnter={onMouseHoverListItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} data-cy="collapse-icon" onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon}  data-cy="expand-icon" onClick={handleClick} />
        )}
        <ListItemAvatar>
          {docRevOwnerAvatar ? (
            <Avatar
              style={{ backgroundColor: `${docRevOwnerInitialColor}` }}
              className={classes.avatar}
              alt={docRevOwnerName}
              src={docRevOwnerAvatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${docRevOwnerInitialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(docRevOwnerName || '')}
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
                  <DocId url={changeRequestEditPath(arChangeRequestId)} docId = {arId} />
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <ApprovalTitle  url={changeRequestEditPath(arChangeRequestId)} title={title || ''} />
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot} />
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
                <RejectIcon
                  data-cy="transition-reject"
                  onMouseEnter={onMouseHoverRejectIcon}
                  className={classes.cursorPointer}
                />
              )}
              {rejectHover && (
                <StyleTooltip
                  title={<Text translation="common.reject" />}
                  placement="top"
                  arrow
                >
                  <RejectSolidIcon
                    data-cy="transition-reject"
                    onClick={handleRejectClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!approveHover && (
                <ApproveIcon
                  data-cy="transition-approve"
                  onMouseEnter={onMouseHoverApproveIcon}
                  className={classes.cursorPointer}
                />
              )}
              {approveHover && (
                <StyleTooltip
                  title={<Text translation="common.approve" />}
                  placement="top"
                  arrow
                >
                  <ApproveSolidIcon
                    data-cy="transition-approve"
                    onClick={handleApproveClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!pinHover && isPinShown && (
                <PinIcon
                  data-cy="pin-icon"
                  onMouseEnter={onMouseHoverPinIcon}
                  className={classes.cursorPointer}
                />
              )}
              {pinHover && isPinShown && (
                <StyleTooltip
                  title={<Text translation="common.pin" />}
                  placement="top"
                  arrow
                >
                  <PinSolidIcon
                    data-cy="pin-solid-icon"
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
              {isUnpinShown && (
                <StyleTooltip
                  title={<Text translation="common.unpin" />}
                  placement="top"
                  arrow
                >
                  <PinSolidIcon
                    data-cy="pin-solid-icon"
                    onClick={handleUnPinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
            {dismissLineItem && (
              <DismissAction classes={classes} onClick={handleDismiss} />
            )}
          </Box>
        )}
        {isUnpinShown && (
          <span className={classes.actionIcon}>
            <StyleTooltip
              title={<Text translation="common.unpin" />}
              placement="top"
              arrow
            >
              <PinSolidIcon
                data-cy="pin-solid-icon"
                onClick={handleUnPinClick}
                className={classes.cursorPointer}
              />
            </StyleTooltip>
          </span>
        )}
        {hoverItem && dismissLineItem && (
          <DismissAction classes={classes} onClick={handleDismiss} />
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense disablePadding className={classes.collapsedList}>
          {docRevs.map((prItem, index) => (
            <StyledListItem button className={classes.nested} key={index} disableRipple>
              <IconButton aria-label="listIcon">
                {getDocIcon(prItem.docTypeGroup, 20, 20)}
              </IconButton>
              <ListItemText
                id={prItem.docId}
                primary={
                  <Grid
                    container={true}
                    wrap="nowrap"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item={true}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={`${classes.typography} ${classes.margin5}`}
                        color="textPrimary"
                        noWrap
                      >
                        {prItem.docId}
                      </Typography>
                    </Grid>
                    <Grid
                      zeroMinWidth
                      item={true}
                      className={classes.truncateText}
                    >
                      <StyleTooltip
                        title={
                          <>
                            <Text translation="dashboard.revision" />
                            &nbsp;{prItem.displayRevision} {prItem.name}
                          </>
                        }
                        placement="top-start"
                        arrow
                        PopperProps={{ popperOptions: {} }}
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          className={`${classes.typographyBold} ${classes.margin5}`}
                          color="textSecondary"
                          noWrap
                        >
                          <>
                            <Text translation="dashboard.revision" />
                            &nbsp;{prItem.displayRevision} {prItem.name}
                          </>
                        </Typography>
                      </StyleTooltip>
                    </Grid>
                  </Grid>
                }
              />
              <Box component="div">
                {viewHoverItem !== prItem.docId && (
                  <ViewIcon className={classes.cursorPointer}
                    onMouseEnter={() => onMouseHoverViewIcon(prItem.docId)}
                  />
                )}
                {viewHoverItem === prItem.docId && (
                  <StyleTooltip
                    classes={{ tooltip: classes.customTooltipWidth }}
                    title={
                      <>
                        <Typography
                          className={classes.viewTooltipText}
                          component="span"
                          variant="caption"
                        >
                          <Text translation="approval.tooltip.description.change.title" />
                        </Typography>
                        <br />
                        <Typography
                          className={classes.typography}
                          noWrap
                          component="span"
                        >
                          {prItem.descriptionOfChange}
                        </Typography>
                        <br />
                        <br />
                        <Typography
                          className={classes.viewTooltipText}
                          component="span"
                          variant="caption"
                        >
                          <Text translation="approval.tooltip.justification.change.title" />
                        </Typography>
                        <br />
                        <Typography
                          className={classes.typography}
                          noWrap
                          component="span"
                        >
                          {prItem.justificationOfChange}
                        </Typography>
                      </>
                    }
                    placement="top"
                    arrow
                  >
                    <ViewSolidIcon onMouseLeave={onMouseLeaveViewIcon} className={classes.cursorPointer} />
                  </StyleTooltip>
                )}
              </Box>
            </StyledListItem>
          ))}
        </List>
      </Collapse>
      <ApproveDialogueContainer
        transition="reject"
        changeRequestId={arChangeRequestId}
        transitionDialog={transitionDialogReject}
        label="transition.action.reject"
      />
      <ApproveDialogueContainer
        transition="approve"
        changeRequestId={arChangeRequestId}
        transitionDialog={transitionDialogApprove}
        label="transition.action.approve"
      />
    </>
  );
};

export default TaskApprovalPresenter;
