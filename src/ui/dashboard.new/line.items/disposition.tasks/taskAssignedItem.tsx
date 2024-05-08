import { Avatar, Box, Collapse, Grid, List, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as CollapseIcon } from '../../../../assets/images/collapse.svg';
import { ReactComponent as ExpandIcon } from '../../../../assets/images/expand.svg';
import { ReactComponent as PinIcon } from '../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../assets/images/pin_solid.svg';
import { translate } from '../../../../common/intl';
import { Nullable } from '../../../../state/ducks/common/types';
import { changeRequestPreviewPath } from '../../../change.request/utils/paths';
import Text from '../../../components/Text';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { getInitalsFromName } from '../../../components/icons/avatar/helpers';
import { documentPreviewPath } from '../../../document.revision/utils/paths';
import Colors from '../../../layout/theme/utils/colors';
import ApprovalTitle from '../common/ApprovalTitle/presenter';
import DismissAction from '../common/DismissAction';
import DocId from '../common/DocId/presenter';
import { StyleTooltip } from '../common/StyleTooltip';
import { StyledListItem } from '../common/StyledListItem';
import useStyles from './taskAssignedItem.styles';

interface Props {
  id: string
  type: string
  ownerName: string
  ownerAvatar: Nullable<string>
  ownerInitialColor: string
  timestamp: string
  status: string
  instruction: string
  title?: string
  docId: string
  revId: string
  documentId?: string
  displayRevision?: string
  hoverItemId: string
  isChangeRequest?: boolean
  isDocumentRevision?: boolean
  onMouseHoverItem: (id: string) => void
  isPinned: boolean
  pinLineItem?: (id: string) => void
  unPinLineItem?: (id: string) => void
  dismissLineItem?: (id: string) => void
}
const TaskAssignedItemPresenter: React.FC<Props> = ({
  id,
  type,
  ownerName,
  ownerAvatar,
  ownerInitialColor,
  timestamp,
  status,
  instruction,
  title,
  docId,
  revId,
  documentId,
  displayRevision,
  hoverItemId,
  isChangeRequest,
  isDocumentRevision,
  onMouseHoverItem,
  unPinLineItem,
  pinLineItem,
  isPinned,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [isPinHover, setIsPinHover] = React.useState(false);
  const [isOpened, setIsOpened] = React.useState(false);
  const isHoverItem = hoverItemId === id;

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
    setIsPinHover(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const handleClick = () => {
    setIsOpened(!isOpened);
  };

  const onMouseLeaveActionIcons = () => {
    setIsPinHover(false);
  };

  const isPinShown = pinLineItem && !isPinned;
  const isUnpinShown = unPinLineItem && isPinned;

  return (
    <>
      <StyledListItem
        button
        divider
        disableRipple
        className={classes.listItem}
        style={isOpened || isHoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        onMouseEnter={onMouseHoverListItem}
        onClick={handleClick}
      >
        {isOpened ? (
          <CollapseIcon className={classes.icon} data-cy="collapse-icon" onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon} data-cy="expand-icon" onClick={handleClick} />
        )}
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
                  className={classes.innerWrap}
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
                      <Text translation="dashboard.task.assignment" />
                    </Typography>
                    {isChangeRequest && <DocId url={changeRequestPreviewPath(revId)} docId = {docId} />}
                  </Grid>
                  <Grid item={true}>
                    { title && <ApprovalTitle url={changeRequestPreviewPath(revId)} title={title ?? ''} /> }
                    { !title && isDocumentRevision && documentId
                        && <ApprovalTitle url={documentPreviewPath(revId, documentId)}
                          title={`${docId} - Rev ${displayRevision}` ?? ''} />}
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
        {isHoverItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span className={classes.actionIcon}>
              { isChangeRequest && <Link
                data-cy="dashboard-change-request-task-view-button"
                to={`${changeRequestPreviewPath(revId)}?tabId=material_disposition`} className={classes.link} >
                {translate('dashboard.task.view')}
              </Link> }
              { isDocumentRevision && documentId && <Link
                data-cy="dashboard-task-view-button"
                to={`${documentPreviewPath(revId, documentId)}`} className={classes.link}
              >
                {translate('dashboard.task.view')}
              </Link> }
            </span>
            <span className={classes.actionIcon}>
              {!isPinHover && isPinShown && (
                <PinIcon
                  data-cy="pin-icon"
                  onMouseEnter={onMouseHoverPinIcon}
                  className={classes.cursorPointer}
                />
              )}
              {isPinHover && isPinShown && (
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
        {isHoverItem && dismissLineItem && (
          <DismissAction classes={classes} onClick={handleDismiss} />
        )}
      </StyledListItem>
      <Collapse in={isOpened} timeout="auto" unmountOnExit>
        <List dense className={classes.collapsedList}>
          <StyledListItem button className={classes.nested} disableRipple>
            <ListItemText
              primary={
                <Grid
                  container={true}
                  wrap="nowrap"
                  justify="flex-start"
                  alignItems="center"
                >
                  <Grid item={true} >
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typographyBold} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      {translate('dashboard.task.instruction')}
                    </Typography>
                    <Tooltip customTooltipClass={classes.tooltipBox} showTooltip data={instruction} childrenElement={
                      <Typography component="span" variant="body2" color="textPrimary" data-cy="instruction-cell" className={`${classes.typography} ${classes.margin5} ${classes.truncateInstrution}`}>{instruction}</Typography>
                    } />
                  </Grid>
                </Grid>
              }
            />
          </StyledListItem>
        </List>
      </Collapse>
    </>

  );
};

export default TaskAssignedItemPresenter;
