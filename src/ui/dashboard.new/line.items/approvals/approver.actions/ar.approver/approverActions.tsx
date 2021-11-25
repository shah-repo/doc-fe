import {
  Avatar,
  Box,
  Collapse,
  Grid,
  IconButton,
  Link,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as CollapseIcon } from "../../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../../assets/images/expand.svg";
import { ReactComponent as PendingReviewItemIcon } from "../../../../../../assets/images/pending_review_nested.svg";
import { ReactComponent as PinIcon } from "../../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../../assets/images/reject_status.svg";
import { ReactComponent as RejectIcon } from "../../../../../../assets/images/reject_status_solid.svg";
import { ReactComponent as ViewIcon } from "../../../../../../assets/images/view.svg";
import { ReactComponent as ViewSolidIcon } from "../../../../../../assets/images/view_solid.svg";
import { Nullable } from "../../../../../../state/ducks/common/types";
import { STATUS_TYPES_LABEL } from "../../../../../../state/ducks/dashboard.new/my.feeds/types";
import { changeRequestEditPath } from "../../../../../change.request/utils/paths";
import { getInitalsFromName } from "../../../../../components/icons/avatar/helpers";
import Text from "../../../../../components/Text";
import Colors from "../../../../../layout/theme/utils/colors";
import { HoverStyleChip } from "../../../common/HoverStyleChipApprovalApproved";
import { HoverStyleChip as RejectedHoverStyleChip } from "../../../common/HoverStyleChipApprovalRejected";
import { NormalStyleChip } from "../../../common/NormalStyleChipApprovalApproved";
import { NormalStyleChip as RejectedNormalStyleChip } from "../../../common/NormalStyleChipApprovalRejected";
import { StyledListItem } from "../../../common/StyledListItem";
import { StyleTooltip } from "../../../common/StyleTooltip";
import { styles } from "./approverActions.styles";

interface Props {
  id: string;
  arId: string;
  arChangeRequestId: string;
  type: string;
  arTitle: string;
  approvalStatusChanged: string;
  timestamp: string;
  docRevs: {
    documentRevisionId: string;
    documentId: string;
    docId: string;
    displayRevision: string;
    name: string;
    justificationOfChange: string;
    descriptionOfChange: string;
  }[];
  approverName: string;
  approverAvatar: Nullable<string>;
  approverInitialColor: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}
const ARApproverActionItemPresenter: React.FunctionComponent<Props> = ({
  id,
  arId,
  arChangeRequestId,
  approvalStatusChanged,
  arTitle,
  docRevs,
  approverName,
  approverAvatar,
  approverInitialColor,
  timestamp,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
}) => {
  const classes = styles();
  const [pinHover, setPinHover] = React.useState(false);


  const [open, setOpen] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState("");
  const hoverItem = hoverItemId === id;
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
  const handleClick = () => {
    setOpen(!open);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const onMouseHoverViewIcon = (id: string) => {
    setViewHoverItem(id);
  };
  const onMouseLeaveViewIcon = () => {
    setViewHoverItem("");
  };
  return (
    <>
      <StyledListItem
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        button
        onMouseEnter={onMouseHoverListItem}
        className={classes.listItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon} onClick={handleClick} />
        )}
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
                {STATUS_TYPES_LABEL.REJECTED === approvalStatusChanged && (
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
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                      {hoverItem && (
                        <RejectedHoverStyleChip
                          color="primary"
                          size="small"
                          icon={<RejectSolidIcon data-cy="transition-reject" />}
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED === approvalStatusChanged && (
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
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                      {hoverItem && (
                        <HoverStyleChip
                          color="primary"
                          size="small"
                          icon={
                            <ApprovedWhiteIcon data-cy="transition-approve" />
                          }
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED !== approvalStatusChanged &&
                  STATUS_TYPES_LABEL.REJECTED !== approvalStatusChanged && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyStatus} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {approvalStatusChanged}
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
                  <Link
                    href={changeRequestEditPath(arChangeRequestId)}
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
                      {arId}
                    </Typography>
                  </Link>
                </Grid>
                {/* {arTitle && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typography} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      <Text translation="common.to" />
                    </Typography>
                  </Grid>
                )} */}
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={changeRequestEditPath(arChangeRequestId)}
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
                      {arTitle}
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
        { hoverItem && !!open && pinned && (
          <Box component="div" className={classes.actionIcons}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip title="Pin item" placement="top" arrow>
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
          </Box>
        )}
        {!open && pinned && (
          <Box component="div" className={classes.actionIcons}>
            <StyleTooltip title="Un Pin item" placement="top" arrow>
              <PinSolidIcon
                onClick={handleUnPinClick}
              />
            </StyleTooltip>
          </Box>
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense disablePadding className={classes.collapsedList}>
          {docRevs.map((prItem, index) => (
            <StyledListItem button className={classes.nested} key={index}>
              <IconButton aria-label="listIcon">
                <PendingReviewItemIcon />
              </IconButton>
              <ListItemText
                id={prItem.docId}
                primary={
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                  >
                    {prItem.name}
                  </Typography>
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
    </>
  );
};

export default ARApproverActionItemPresenter;
