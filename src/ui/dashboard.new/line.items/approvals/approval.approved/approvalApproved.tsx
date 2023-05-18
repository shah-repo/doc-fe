import { Box, Collapse, Grid, IconButton, List, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { ReactComponent as ApprovedIcon } from '../../../../../assets/images/approved_status.svg';
import { ReactComponent as ApprovedWhiteIcon } from '../../../../../assets/images/approved_status_white.svg';
import { ReactComponent as CloseIcon } from '../../../../../assets/images/close.svg';
import { ReactComponent as CloseSolidIcon } from '../../../../../assets/images/close_solid.svg';
import { ReactComponent as CollapseIcon } from '../../../../../assets/images/collapse.svg';
import { ReactComponent as ExpandIcon } from '../../../../../assets/images/expand.svg';
import { ReactComponent as PendingReviewIcon } from '../../../../../assets/images/pending_approval.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as ViewIcon } from '../../../../../assets/images/view.svg';
import { ReactComponent as ViewSolidIcon } from '../../../../../assets/images/view_solid.svg';
import { ChangeRequestTransitionResponse } from '../../../../../state/ducks/changeRequest/types';
import { STATUS_TYPES_LABEL } from '../../../../../state/ducks/dashboard.new/my.feeds/types';
import { changeRequestEditPath } from '../../../../change.request/utils/paths';
import Text from '../../../../components/Text';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import ApprovalTitle from '../../common/ApprovalTitle/presenter';
import { getDocIcon } from '../../common/DocIcon';
import DocId from '../../common/DocId/presenter';
import { HoverStyleChip } from '../../common/HoverStyleChipApprovalApproved';
import { NormalStyleChip } from '../../common/NormalStyleChipApprovalApproved';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import { DocTypeGroups } from '../../common/types';
import ApproveDialogueContainer from '../../dialogs/approveDialogueContainer';
import useStyles from './approvalApproved.styles';
import DismissAction from '../../common/DismissAction';

interface Props {
  id: string;
  type: string;
  title: string;
  arId: string;
  arChangeRequestId: string;
  arStatus: string;
  timestamp: string;
  docRevs: {
    docTypeGroup: DocTypeGroups;
    documentRevisionId: string;
    documentId: string;
    docId: string;
    displayRevision: string;
    name: string;
    justificationOfChange: string;
    descriptionOfChange: string;
  }[];
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem?: (id: string) => void;
  unPinLineItem?: (id: string) => void;
  dismissLineItem?: (id: string) => void;
}
const ApprovalApprovedPresenter: React.FC<Props> = ({
  id,
  arId,
  arChangeRequestId,
  arStatus,
  title,
  timestamp,
  docRevs,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [closeHover, setCloseHover] = React.useState(false);
  const [pinHover, setPinHover] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState('');
  const transitionDialog = useDialog();
  const hoverItem = hoverItemId === id;

  const handleClick = () => {
    setOpen(!open);
  };
  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const handlePinClick = () => {
    pinLineItem?.(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem?.(id);
  };
  const handleCloseClick = () => {
    openClosedDialog();
    setClosed(!closed);
  };
  const openClosedDialog = () => {
    async.reset();
    transitionDialog.open();
  };
  const onMouseLeaveActionIcons = () => {
    setCloseHover(false);
    setPinHover(false);
  };
  const onMouseHoverPinIcon = () => {
    setCloseHover(false);
    setPinHover(true);
  };
  const onMouseHoverCloseIcon = () => {
    setPinHover(false);
    setCloseHover(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const onMouseHoverViewIcon = (id: string) => {
    setViewHoverItem(id);
  };
  const onMouseLeaveViewIcon = () => {
    setViewHoverItem('');
  };
  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      transitionDialog.close();
    },
    onError: (error) => {
      transitionDialog.close();
    },
  });

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
          <ExpandIcon className={classes.icon} data-cy="expand-icon" onClick={handleClick} />
        )}
        <ListItemIcon>
          <PendingReviewIcon height={30} width={30} />
        </ListItemIcon>
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
                  <DocId url={changeRequestEditPath(arChangeRequestId)} docId={arId}/>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <ApprovalTitle url={changeRequestEditPath(arChangeRequestId)} title={title}/>
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
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyStatus}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<ApprovedIcon />}
                        label={STATUS_TYPES_LABEL[arStatus]}
                      />
                    )}
                    {hoverItem && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<ApprovedWhiteIcon />}
                        label={STATUS_TYPES_LABEL[arStatus]}
                      />
                    )}
                  </Typography>
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
              {!closeHover && (
                <CloseIcon
                  data-cy="close-icon"
                  className={classes.cursorPointer}
                  onMouseEnter={onMouseHoverCloseIcon}
                />
              )}
              {closeHover && (
                <StyleTooltip
                  title={<Text translation="common.close" />}
                  placement="top"
                  arrow
                >
                  <CloseSolidIcon
                    data-cy="close-icon-solid"
                    className={classes.cursorPointer}
                    onClick={handleCloseClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
            {!pinned && (
              <span className={classes.actionIcon}>
                {!pinHover && isPinShown && (
                  <PinIcon
                    data-cy="pin-icon"
                    className={classes.cursorPointer}
                    onMouseEnter={onMouseHoverPinIcon}
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
                  <ViewIcon
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
                    <ViewSolidIcon onMouseLeave={onMouseLeaveViewIcon} />
                  </StyleTooltip>
                )}
              </Box>
            </StyledListItem>
          ))}
        </List>
      </Collapse>
      <ApproveDialogueContainer
        transition="closed"
        changeRequestId={arChangeRequestId}
        arId={arId}
        title={title}
        transitionDialog={transitionDialog}
        label="transition.action.reject"
      />
    </>
  );
};

export default ApprovalApprovedPresenter;
