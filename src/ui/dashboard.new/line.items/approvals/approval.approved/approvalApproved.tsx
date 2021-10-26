/* eslint-disable react-hooks/rules-of-hooks */
import {
  Chip, Collapse, Grid, IconButton,
  List, ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as CloseIcon } from "../../../../../assets/images/close.svg";
import { ReactComponent as CloseSolidIcon } from "../../../../../assets/images/close_solid.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PendingReviewItemIcon } from "../../../../../assets/images/pending_review_nested.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as ViewIcon } from "../../../../../assets/images/view.svg";
import { ReactComponent as ViewSolidIcon } from "../../../../../assets/images/view_solid.svg";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./approvalApproved.styles";

interface Props {
  id: string;
  type: string;
  title: string | undefined;
  arId: string | undefined;
  arStatus: string | undefined;
  timestamp: string | undefined;
  pendingApprovers: any[] | undefined;
  docRevs: any;
}
const approvalChangePresenter: React.FunctionComponent<Props> = ({
  arId,
  arStatus,
  title,
  timestamp,
  docRevs,
}) => {
  const classes = styles();

  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  const NormalStyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.latest_green_varient,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor: Colors.latest_green_varient,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.white,
    },
  })(Chip);

  const StyleTooltip = withStyles({
    arrow: {
      color: Colors.black,
    },
    tooltip: {
      backgroundColor: Colors.black,
    },
    tooltipPlacementTop: {
      margin: "8px 0",
    },
  })(Tooltip);

  const [closeHover, setCloseHover] = React.useState(false);
  const [pinHover, setPinHover] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState("");

  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    setPinned(!pinned);
  };
  const handleCloseClick = () => {
    setClosed(!closed);
  };
  const onMouseHoverItem = () => {
    setHoverItem(true);
  };
  const onMouseLeaveItem = () => {
    setHoverItem(false);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const onMouseHoverCloseIcon = () => {
    setCloseHover(true);
  };
  const onMouseLeaveCloseIcon = () => {
    setCloseHover(false);
  };
  const handleViewClick = (id: string) => {
    // setViewItem(id);
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
        button
        onMouseEnter={onMouseHoverItem}
        onMouseLeave={onMouseLeaveItem}
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        className={classes.listItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon}  onClick={handleClick}/>
        ) : (
          <ExpandIcon className={classes.icon}  onClick={handleClick}/>
        )}
        <ListItemIcon>
          <PendingReviewIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid container={true} wrap="nowrap">
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {arId}&nbsp;
                  </Typography>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {title}&nbsp;
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
                  is&nbsp;
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
                        label={arStatus}
                      />
                    )}
                    {hoverItem && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<ApprovedWhiteIcon />}
                        label={arStatus}
                      />
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container={true}>
                <Grid item={true} className={classes.grayDot}>
                  &nbsp;
                </Grid>
                <Grid item={true} md={12} sm={12}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                  >
                   &nbsp; {timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          }
        />
        {!open && hoverItem && (
          <div className={classes.actionIcons}>
            <span>
              {!closeHover && <CloseIcon onMouseEnter={onMouseHoverCloseIcon} />}
              {closeHover && (
                <StyleTooltip title="Close" placement="top" arrow>
                  <CloseSolidIcon
                    onClick={handleCloseClick}
                    onMouseLeave={onMouseLeaveCloseIcon}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
              {pinHover && (
                <StyleTooltip title="Pin item" placement="top" arrow>
                  <PinSolidIcon
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeavePinIcon}
                  />
                </StyleTooltip>
              )}
            </span>
          </div>
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
              <div>
                {viewHoverItem !== prItem.docId && (
                  <ViewIcon
                    onMouseEnter={() => onMouseHoverViewIcon(prItem.docId)}
                  />
                )}
                {viewHoverItem === prItem.docId && (
                  <StyleTooltip
                    classes={{ tooltip: classes.customTooltipWidth }}
                    title={
                      <React.Fragment>
                        <Typography
                          className={classes.viewTooltipText}
                          component="span"
                          variant="caption"
                        >
                          <Text translation="approval.closed.descriptionOfChangeTitle" />
                        </Typography>
                        <br />
                        <Typography
                          className={classes.typography}
                          noWrap
                          component="span"
                        >
                          {prItem.justificationOfChange}
                        </Typography>
                        <br />
                        <br />
                        <Typography
                          className={classes.viewTooltipText}
                          component="span"
                          variant="caption"
                        >
                          <Text translation="approval.closed.JustificationChangeTitle" />
                        </Typography>
                        <br />
                        <Typography
                          className={classes.typography}
                          noWrap
                          component="span"
                        >
                          {prItem.descriptionOfChange}
                        </Typography>
                      </React.Fragment>
                    }
                    placement="top"
                    arrow
                  >
                    <ViewSolidIcon
                      onClick={() => handleViewClick(prItem.id)}
                      onMouseLeave={onMouseLeaveViewIcon}
                    />
                  </StyleTooltip>
                )}
              </div>
            </StyledListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default approvalChangePresenter;
