import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Link,
  List,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@material-ui/core";
import { size } from "lodash";
import React from "react";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as InReviewWhiteIcon } from "../../../../../assets/images/in_review_status.svg";
import { ReactComponent as InReviewIcon } from "../../../../../assets/images/in_review_status_white.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PendingReviewItemIcon } from "../../../../../assets/images/pending_review_nested.svg";
import { ReactComponent as ViewIcon } from "../../../../../assets/images/view.svg";
import { ReactComponent as ViewSolidIcon } from "../../../../../assets/images/view_solid.svg";
import { Nullable } from "../../../../../state/ducks/common/types";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { changeRequestEditPath } from "../../../../change.request/utils/paths";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";
import { HoverStyleChip } from "../../common/HoverStyleChipPendingReview";
import { NormalStyleChip } from "../../common/NormalStyleChipPendingReview";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import EmailModal from "../../dialogs/email/EmailDialog";
import { styles } from "./pendingReview.styles";

interface Props {
  id: string;
  type: string;
  title: string | undefined;
  arId: string | undefined;
  arStatus: string;
  timestamp: string | undefined;
  pendingApprovers:
    | {
        userName: string;
        employeeId: string;
        userAvatar: Nullable<string>;
        userInitialColor: string;
        approvalStatus: string;
      }[]
    | undefined;
  approvedApprovers:
    | {
        userName: string;
        employeeId: string;
        userAvatar: Nullable<string>;
        userInitialColor: string;
        approvalStatus: string;
      }[]
    | undefined;
  docRevs: {
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
}
const PendingReviewPresenter: React.FunctionComponent<Props> = ({
  id,
  arId,
  timestamp,
  docRevs,
  title,
  arStatus,
  pendingApprovers,
  approvedApprovers,
  hoverItemId,
  onMouseHoverItem,
}) => {
  const classes = styles();
  id = "02358497-19c6-412f-8ac4-cff69fefcd50"; // TO DO: needs to be removed after getting proper API response

  // const [pinHover, setPinHover] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // const [pinned, setPinned] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  // const handlePinClick = () => {
  //   setPinned(!pinned);
  // };
  const handleViewClick = (id: string) => {
    // setViewItem(id);
  };
  const hoverItem = hoverItemId === id;

  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  // const onMouseHoverPinIcon = () => {
  //   setPinHover(true);
  // };
  // const onMouseLeavePinIcon = () => {
  //   setPinHover(false);
  // };
  const onMouseHoverViewIcon = (id: string) => {
    setViewHoverItem(id);
  };
  const onMouseLeaveViewIcon = () => {
    setViewHoverItem("");
  };
  const openApproversModel = (e) => {
    e.stopPropagation();
    setEmailModelopen(true);
  };
  const handleEmailModelClose = () => {
    setEmailModelopen(false);
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
        <ListItemIcon>
          <PendingReviewIcon />
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
                  <Link
                    href={changeRequestEditPath(id)}
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
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyBold} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {title}
                    </Typography>
                  </Link>
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
                        <Typography color="inherit">
                          <Text
                            translation="assigned.users.count"
                            values={{
                              count:
                                size(pendingApprovers) +
                                size(approvedApprovers),
                            }}
                          />
                          <br />
                          <Text
                            translation="approved.and.pending.count"
                            values={{
                              approved: size(approvedApprovers),
                              pending: size(pendingApprovers),
                            }}
                          />
                        </Typography>
                      </>
                    }
                    placement="top-start"
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
                              .join(",")
                          : ""}
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
        {/* {!open && hoverItem && (
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
        )} */}
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
                    <ViewSolidIcon
                      onClick={() => handleViewClick(prItem.docId)}
                      onMouseLeave={onMouseLeaveViewIcon}
                    />
                  </StyleTooltip>
                )}
              </Box>
            </StyledListItem>
          ))}
        </List>
      </Collapse>
      <Modal
        open={emailModelopen}
        onClose={handleEmailModelClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <EmailModal
          handleEmailModelClose={handleEmailModelClose}
          pendingApprovers={pendingApprovers}
        />
      </Modal>
    </>
  );
};

export default PendingReviewPresenter;
