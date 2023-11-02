import { Avatar, Box, Collapse, Grid, List, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as CollapseIcon } from '../../../../assets/images/collapse.svg';
import { ReactComponent as ExpandIcon } from '../../../../assets/images/expand.svg';
import { ReactComponent as PinIcon } from '../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../assets/images/pin_solid.svg';
import { Nullable } from '../../../../state/ducks/common/types';
import { changeRequestPreviewPath } from '../../../change.request/utils/paths';
import { getInitalsFromName } from '../../../components/icons/avatar/helpers';
import Text from '../../../components/Text';
import Colors from '../../../layout/theme/utils/colors';
import ApprovalTitle from '../common/ApprovalTitle/presenter';
import DismissAction from '../common/DismissAction';
import DocId from '../common/DocId/presenter';
import { StyledListItem } from '../common/StyledListItem';
import { StyleTooltip } from '../common/StyleTooltip';
import useStyles from './taskAssignedItem.styles';

interface Props {
  id: string
  type: string
  arOwnerName: string
  arOwnerAvatar: Nullable<string>
  arOwnerInitialColor: string
  timestamp: string
  status: string
  instruction: string
  arTitle: string
  arId: string
  arChangeRequestId: string
  hoverItemId: string
  onMouseHoverItem: (id: string) => void
  pinned: boolean
  pinLineItem?: (id: string) => void
  unPinLineItem?: (id: string) => void
  dismissLineItem?: (id: string) => void
}
const TaskAssignedItemPresenter: React.FC<Props> = ({
  id,
  type,
  arOwnerName,
  arOwnerAvatar,
  arOwnerInitialColor,
  timestamp,
  status,
  instruction,
  arTitle,
  arId,
  arChangeRequestId,
  hoverItemId,
  onMouseHoverItem,
  unPinLineItem,
  pinLineItem,
  pinned,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [pinHover, setPinHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
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
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const handleClick = () => {
    setOpen(!open);
  };

  const onMouseLeaveActionIcons = () => {
    setPinHover(false);
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
        onClick={handleClick}
      >
        {open ? (
          <CollapseIcon className={classes.icon} data-cy="collapse-icon" onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon} data-cy="expand-icon" onClick={handleClick} />
        )}
        <ListItemAvatar>
          {arOwnerAvatar ? (
            <Avatar
              style={{ backgroundColor: `${arOwnerInitialColor}` }}
              className={classes.avatar}
              alt={arOwnerName}
              src={arOwnerAvatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${arOwnerInitialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(arOwnerName)}
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
                      {arOwnerName}
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
                      <Text translation="task.assignment" />
                    </Typography>
                    <DocId url={changeRequestPreviewPath(arChangeRequestId)} docId = {arId} />
                  </Grid>
                  <Grid item={true}>
                    <ApprovalTitle url={changeRequestPreviewPath(arChangeRequestId)} title={arTitle || ''} />
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
        {hoverItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span className={classes.actionIcon}>
              <Link
                to={`${changeRequestPreviewPath(arChangeRequestId)}?tabId=material_disposition`}
                target="_blank"
                className={classes.link}
              >
                View
              </Link>
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
        {hoverItem && dismissLineItem && (
          <DismissAction classes={classes} onClick={handleDismiss} />
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
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
                      Instruction:
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typography} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      {instruction}
                    </Typography>
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
