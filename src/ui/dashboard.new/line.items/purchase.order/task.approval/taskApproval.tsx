import { Avatar, Box, Grid, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as ApproveIcon } from '../../../../../assets/images/approve.svg';
import { ReactComponent as ApproveSolidIcon } from '../../../../../assets/images/approve_solid.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as RejectIcon } from '../../../../../assets/images/reject.svg';
import { ReactComponent as RejectSolidIcon } from '../../../../../assets/images/reject_solid.svg';
import { approvalsActions } from '../../../../../state/ducks/approvals';
import { Nullable } from '../../../../../state/ducks/common/types';
import { dashboardMyFeedsActions } from '../../../../../state/ducks/dashboard.new/my.feeds';
import { dashboardTodoActions } from '../../../../../state/ducks/dashboard.new/todo';
import { getInitalsFromName } from '../../../../components/icons/avatar/helpers';
import Text from '../../../../components/Text';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import DocId from '../../common/DocId/presenter';
import DocTitle from '../../common/DocTitle/presenter';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import ApproveDialogueContainer from './POApprovalDialogContainer';
import useStyles from './taskApproval.styles';
import DismissAction from '../../common/DismissAction';

interface Props {
  id: string
  docDocumentId: string
  type: string
  docId: string
  docRevId: string
  approvalId: string
  timestamp: string
  docRevOwnerAvatar: Nullable<string>
  docRevOwnerInitialColor: string
  docRevOwnerName: string
  docRevName: string
  docRevVersion: string
  hoverItemId: string
  onMouseHoverItem: (id: string) => void
  pinned: boolean
  pinLineItem?: (id: string) => void
  unPinLineItem?: (pinnedItemId: string) => void
  dismissLineItem?: (id: string) => void
}
const TaskApprovalPresenter: React.FC<Props> = ({
  id,
  docDocumentId,
  docId,
  approvalId,
  docRevId,
  docRevOwnerName,
  timestamp,
  docRevName,
  docRevVersion,
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
  const dispatch = useDispatch();
  const [pinHover, setPinHover] = React.useState(false);
  const [approveHover, setApproveHover] = React.useState(false);
  const [rejectHover, setRejectHover] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
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
  const handleApproveClick = () => {
    openApproveDialog();
    setApproved(!approved);
  };
  const handleRejectClick = () => {
    onReject();
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
  const openApproveDialog = () => {
    transitionDialog.open();
  };

  const rejectDialogAsync = useAsync({
    onSuccess: () => {
      dispatch(dashboardTodoActions.loadMyFeedsList());
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    },
  });
  const applyTransition = useActionCreator(approvalsActions.applyTransition);
  const onReject = () => {
    rejectDialogAsync.start(
      applyTransition,
      approvalId,
      'reject',
      rejectDialogAsync,
      null,
    );
  };

  const isPinShown = pinLineItem && !pinned;
  const isUnpinShown = unPinLineItem && pinned;

  return (
    <>
      <StyledListItem
        button
        divider
        disableRipple
        onMouseEnter={onMouseHoverListItem}
        className={classes.buttoncursor}
      >
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
              {getInitalsFromName(docRevOwnerName)}
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
                  <DocId
                    url={docId ? documentVersionPath(docRevId || '', docDocumentId) : '#'}
                    docId={docId}
                  />
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <DocTitle
                    url={docRevId ? documentVersionPath(docRevId || '', docDocumentId) : '#'}
                    docRevVersion={docRevVersion}
                    docRevName={docRevName}
                  />
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
            className={`${classes.actionIcons} ${classes.nonPoActionIconsWidth}`}
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
            {isPinShown && (
              <span className={classes.actionIcon}>
                {!pinHover && (
                  <PinIcon
                    data-cy="pin-icon"
                    onMouseEnter={onMouseHoverPinIcon}
                    className={classes.cursorPointer}
                  />
                )}
                {pinHover && (
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
              </span>
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
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              </span>
            )}
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
                onMouseLeave={onMouseLeaveActionIcons}
                className={classes.cursorPointer}
              />
            </StyleTooltip>
          </span>
        )}
        {hoverItem && dismissLineItem && (
          <DismissAction classes={classes} onClick={handleDismiss} />
        )}
      </StyledListItem>
      <ApproveDialogueContainer
        transition="approve"
        approvalId={approvalId}
        transitionDialog={transitionDialog}
        label="transition.action.approve"
      />
    </>
  );
};

export default TaskApprovalPresenter;
