/* eslint-disable react-hooks/rules-of-hooks */
import {
  Chip,
  Grid,
  ListItem,
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
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
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
  // eslint-disable-next-line no-console
  console.log("approvalChangePresenter");
  return (
    <StyledListItem
      button
      onMouseEnter={onMouseHoverItem}
      onMouseLeave={onMouseLeaveItem}
    >
      <ListItemIcon className={classes.listItemIcon}>
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
              <Grid item ={true}>
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
                  variant="caption"
                  className={classes.typographyStatus}
                  color="textSecondary"
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
      {hoverItem && (
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
  );
};

export default approvalChangePresenter;
