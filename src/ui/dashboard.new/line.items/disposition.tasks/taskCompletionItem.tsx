import { Avatar, Box, Grid, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { ActionCreator } from 'redux';
import { ReactComponent as PinIcon } from '../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../assets/images/pin_solid.svg';
import { translate } from '../../../../common/intl';
import { Nullable } from '../../../../state/ducks/common/types';
import { MyFeedsListApiResponse } from '../../../../state/ducks/dashboard.new/my.feeds/types';
import { taskActions } from '../../../../state/ducks/tasks';
import { ApiAction } from '../../../../state/types';
import { getInitalsFromName } from '../../../components/icons/avatar/helpers';
import Text from '../../../components/Text';
import { documentPreviewPath } from '../../../document.revision/utils/paths';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import Colors from '../../../layout/theme/utils/colors';
import ApprovalTitle from '../common/ApprovalTitle/presenter';
import DismissAction from '../common/DismissAction';
import { StyledListItem } from '../common/StyledListItem';
import { StyleTooltip } from '../common/StyleTooltip';
import useStyles from './taskAssignedItem.styles';

interface Props {
  id: string
  ownerName: string
  ownerAvatar: Nullable<string>
  ownerInitialColor: string
  timestamp: string
  docId: string
  revId: string
  approvalId: string
  displayRevision?: string
  hoverItemId: string
  docDocumentId?: string
  onMouseHoverItem: (id: string) => void
  isPinned: boolean
  pinLineItem?: (id: string) => void
  unPinLineItem?: (id: string) => void
  loadMyFeeds: ActionCreator<ApiAction<MyFeedsListApiResponse, any>>
  dismissLineItem?: (id: string) => void
}
const TaskCompletedItemPresenter: React.FC<Props> = ({
  id,
  ownerName,
  ownerAvatar,
  ownerInitialColor,
  timestamp,
  docId,
  revId,
  displayRevision,
  hoverItemId,
  approvalId,
  docDocumentId,
  loadMyFeeds,
  onMouseHoverItem,
  unPinLineItem,
  pinLineItem,
  isPinned,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [isPinHovered, setIsPinHovered] = React.useState(false);
  const isHoveredItem = hoverItemId === id;

  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const handlePinClick = () => {
    pinLineItem?.(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem?.(id);
  };
  const onMouseHoverPinIcon = () => {
    setIsPinHovered(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };

  const onMouseLeaveActionIcons = () => {
    setIsPinHovered(false);
  };

  const isPinShown = pinLineItem && !isPinned;
  const isUnpinShown = unPinLineItem && isPinned;

  const completeWO = useActionCreator(taskActions.completeWO);

  const async = useAsync();
  const closeWOAsync = useAsync({
    onSuccess: () => {
      async.start(loadMyFeeds);
    },
  });

  const onApproveClick = () => {
    closeWOAsync.start(completeWO, approvalId, closeWOAsync);
  };

  return (
    <>
      <StyledListItem
        button
        divider
        disableRipple
        className={classes.listItem}
        style={isHoveredItem ? { backgroundColor: Colors.sky_blue } : {}}
        onMouseEnter={onMouseHoverListItem}
      >
        <ListItemAvatar>
          {ownerAvatar ? (
            <Avatar
              style={{ backgroundColor: `${ownerInitialColor}` }}
              className={classes.avatar}
              alt={ownerName}
              src={ownerAvatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${ownerInitialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(ownerName)}
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Grid item={true} lg={12} className={classes.innerWrap}>
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
                      {ownerName}
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
                      <Text translation="require.completion" />
                    </Typography>
                    { docDocumentId && revId && <ApprovalTitle url={documentPreviewPath(revId, docDocumentId)}
                      title={translate('dashboard.task.complete.rev', { docId, displayRevision }) ?? ''} />}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot} />
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
        {isHoveredItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span className={classes.actionIcon}>
              { approvalId && <Link
                to="#"
                className={classes.link}
                onClick={onApproveClick}
              >
                {translate('dashboard.task.complete')}
              </Link> }
            </span>
            <span className={classes.actionIcon}>
              {!isPinHovered && isPinShown && (
                <PinIcon
                  data-cy="pin-icon"
                  onMouseEnter={onMouseHoverPinIcon}
                  className={classes.cursorPointer}
                />
              )}
              {isPinHovered && isPinShown && (
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
              <DismissAction classes={classes} alignCloseClass={classes.closeIconMobile} onClick={handleDismiss} />
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
        {isHoveredItem && dismissLineItem && (
          <DismissAction classes={classes} onClick={handleDismiss} />
        )}
      </StyledListItem>
    </>

  );
};

export default TaskCompletedItemPresenter;
