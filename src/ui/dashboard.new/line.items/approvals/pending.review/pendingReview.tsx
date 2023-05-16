import { Box, Collapse, Grid, IconButton, Link, List, ListItemIcon, ListItemText, Modal, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as CollapseIcon } from '../../../../../assets/images/collapse.svg';
import { ReactComponent as ExpandIcon } from '../../../../../assets/images/expand.svg';
import { ReactComponent as InReviewWhiteIcon } from '../../../../../assets/images/in_review_status.svg';
import { ReactComponent as InReviewIcon } from '../../../../../assets/images/in_review_status_white.svg';
import { ReactComponent as PendingReviewIcon } from '../../../../../assets/images/pending_approval.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as ViewIcon } from '../../../../../assets/images/view.svg';
import { ReactComponent as ViewSolidIcon } from '../../../../../assets/images/view_solid.svg';
import { Nullable } from '../../../../../state/ducks/common/types';
import { dashboardMyFeedsActions } from '../../../../../state/ducks/dashboard.new/my.feeds';
import { STATUS_TYPES_LABEL } from '../../../../../state/ducks/dashboard.new/my.feeds/types';
import { changeRequestEditPath } from '../../../../change.request/utils/paths';
import Text from '../../../../components/Text';
import Colors from '../../../../layout/theme/utils/colors';
import ApprovalTitle from '../../common/ApprovalTitle/presenter';
import { getDocIcon } from '../../common/DocIcon';
import DocId from '../../common/DocId/presenter';
import { HoverStyleChip } from '../../common/HoverStyleChipPendingReview';
import { NormalStyleChip } from '../../common/NormalStyleChipPendingReview';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import { DocTypeGroups } from '../../common/types';
import { getPendingTooltipText } from '../../common/Utils';
import EmailModal from '../../dialogs/email/EmailDialog';
import useStyles from './pendingReview.styles';
import DismissAction from '../../common/DismissAction';

interface Props {
  id: string;
  type: string;
  title: string;
  arId: string;
  arChangeRequestId: string;
  arStatus: string;
  timestamp: string;
  pendingApprovers: {
    userName: string;
    employeeId: string;
    userAvatar: Nullable<string>;
    userInitialColor: string;
    approvalStatus: string;
  }[];
  approvedApprovers: {
    userName: string;
    employeeId: string;
    userAvatar: Nullable<string>;
    userInitialColor: string;
    approvalStatus: string;
  }[];
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
  pendingEmailSentAt: Nullable<string>;
  dismissLineItem?: (id: string) => void;
}
const PendingReviewPresenter: React.FC<Props> = ({
  id,
  arId,
  arChangeRequestId,
  timestamp,
  docRevs,
  title,
  arStatus,
  pendingApprovers,
  approvedApprovers,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
  pendingEmailSentAt,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [pinHover, setPinHover] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [lastEmailSent, setLastEmailSent] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);
  const { count, pending, approved, primaryText, secondaryText } =
    getPendingTooltipText(pendingApprovers, approvedApprovers);
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
  const hoverItem = hoverItemId === id;
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const onMouseHoverViewIcon = (id: string) => {
    setViewHoverItem(id);
  };
  const onMouseLeaveViewIcon = () => {
    setViewHoverItem('');
  };
  const openApproversModel = (e) => {
    e.stopPropagation();
    setLastEmailSent(false);
    setEmailModelopen(true);
  };
  const handleEmailModelClose = () => {
    setEmailModelopen(false);
  };
  const onClose = () => {
    handleEmailModelClose();
    if (lastEmailSent) {
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    }
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
                data-cy={arId + 'InReview'}
              >
                <Grid item={true}>
                  <DocId  url={changeRequestEditPath(arChangeRequestId)} docId={arId}/>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <ApprovalTitle url={changeRequestEditPath(arChangeRequestId)}  title={title}/>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    onClick={openApproversModel}
                    className={`${classes.typographyStatus} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && !open && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<InReviewWhiteIcon />}
                        label={STATUS_TYPES_LABEL[arStatus]}
                      />
                    )}
                    {(hoverItem || open) && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<InReviewIcon />}
                        label={STATUS_TYPES_LABEL[arStatus]}
                      />
                    )}
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
                    <Text translation="pending.approval" />
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid
                  zeroMinWidth
                  item={true}
                  className={`${classes.truncateText} ${classes.margin7}`}
                >
                  <StyleTooltip
                    title={
                      <>
                        <Text
                          translation={primaryText}
                          values={{ count }}
                        />
                        <br />
                        <Text
                          translation={secondaryText}
                          values={{
                            approved,
                            pending,
                          }}
                        />
                      </>
                    }
                    placement="top-start"
                    arrow
                    PopperProps={{ popperOptions: {} }}
                  >
                    <Link
                      href="#"
                      color="inherit"
                      onClick={openApproversModel}
                      className={classes.link}
                    >
                      <Typography
                        component="span"
                        variant="caption"
                        className={classes.typographyBold}
                        color="textSecondary"
                        noWrap
                      >
                        {pendingApprovers !== undefined
                          ? pendingApprovers
                            .map((approver) => approver.userName)
                            .join(', ')
                          : ''}
                      </Typography>
                    </Link>
                  </StyleTooltip>
                </Grid>
                <Grid
                  item={true}
                  className={`${classes.grayDot} ${classes.margin5}`}
                ></Grid>
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
      <Modal
        open={emailModelopen}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onClose={onClose}
      >
        <EmailModal
          id={id}
          handleEmailModelClose={onClose}
          pendingApprovers={pendingApprovers}
          setLastEmailSent={setLastEmailSent}
          approvedApprovers={approvedApprovers}
          pendingEmailSentAt={pendingEmailSentAt}
        />
      </Modal>
    </>
  );
};

export default PendingReviewPresenter;
