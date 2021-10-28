/* eslint-disable react-hooks/rules-of-hooks */
import {
  Chip,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import { size } from "lodash";
import React from "react";
import { ReactComponent as CloseSolidIcon } from "../../../../../assets/images/close_solid.svg";
import { ReactComponent as CloseWhiteIcon } from "../../../../../assets/images/close_status_white.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PendingReviewItemIcon } from "../../../../../assets/images/pending_review_nested.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as ViewIcon } from "../../../../../assets/images/view.svg";
import { ReactComponent as ViewSolidIcon } from "../../../../../assets/images/view_solid.svg";
import { changeRequestEditPath } from "../../../../change.request/utils/paths";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./approvalClosed.styles";

interface Props {
  id: string;
  type: string;
  title: string | undefined;
  arId: string | undefined;
  arStatus: string | undefined;
  timestamp: string | undefined;
  pendingApprovers: any[] | undefined;
  docRevs: any;
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}
const approvalClosedPresenter: React.FunctionComponent<Props> = ({
  id,
  arId,
  arStatus,
  title,
  timestamp,
  pendingApprovers,
  docRevs,
  hoverItemId,
  onMouseHoverItem,
}) => {
  const classes = styles();
  id = "02358497-19c6-412f-8ac4-cff69fefcd50"; // TO DO: needs to be removed after getting proper API response

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
      color: Colors.font_gray,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor: Colors.font_gray,
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

  const [pinHover, setPinHover] = React.useState(false);
  const [viewHoverItem, setViewHoverItem] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const hoverItem = hoverItemId === arId;
  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    setPinned(!pinned);
  };
  const handleViewClick = (id: string) => {
    // setViewItem(id);
  };

  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(arId || id);
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
    setViewHoverItem("");
  };
  const openApproversModel = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <StyledListItem
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        button
        onMouseEnter={onMouseHoverItemListItem}
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
            <React.Fragment>
              <Grid container={true} wrap="nowrap" justify="flex-start" alignItems="center">
                <Grid item={true}>
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className= {classes.link}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.typography}
                      color="textPrimary"
                      noWrap
                    >
                      {arId}
                    </Typography>&nbsp;
                  </Link>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className= {classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      noWrap
                    >
                      {title}
                    </Typography>&nbsp;
                  </Link>
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
                    {!hoverItem && !open && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<CloseSolidIcon />}
                        label={arStatus}
                      />
                    )}
                    {(hoverItem || open) && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<CloseWhiteIcon />}
                        label={arStatus}
                      />
                    )}
                    &nbsp;
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <StyleTooltip
                    title={
                      <>
                        <Typography color="inherit">
                          Assigned to {size(pendingApprovers)} users. <br />4
                          have Approved and 6 are Pending.
                        </Typography>
                      </>
                    }
                    placement="top-start"
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      onClick={openApproversModel}
                      noWrap
                    >
                      {pendingApprovers?.join(",")}
                    </Typography>
                  </StyleTooltip>
                  &nbsp;&nbsp;
                </Grid>
                <Grid item={true} className={classes.grayDot}>
                  &nbsp;
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
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
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip title="Pin item" placement="top" arrow>
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
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

export default approvalClosedPresenter;
