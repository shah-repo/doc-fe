/* eslint-disable no-console */
import {
  Chip,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { size } from "lodash";
import React from "react";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./newTraining.styles";
interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  verbose: string;
  dueDate: string;
  approvers: string[];
}
const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  title,
  status,
  timestamp,
  dueDate,
  approvers,
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
      color:
        status === "OVERDUE"
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor:
        status === "OVERDUE"
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
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
  const [pinned, setPinned] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);

  const handlePinClick = () => {
    console.log("Pin Clicked");
    setPinned(!pinned);
    console.log("Pinned:: ", !pinned);
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
  // eslint-disable-next-line no-console
  console.log("Pending Training Presenter ::");
  return (
    <StyledListItem
      button
      onMouseEnter={onMouseHoverItem}
      onMouseLeave={onMouseLeaveItem}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <TrainingIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <React.Fragment>
            <Grid
              container={true}
              wrap="nowrap"
              justify="center"
              alignItems="center"
            >
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                  noWrap
                >
                  Your Training {status === "OVERDUE" ? "" : "on"}&nbsp;
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
                  {id}&nbsp;
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
                  noWrap
                >
                  {!hoverItem && (
                    <NormalStyleChip
                      size="small"
                      color="primary"
                      icon={
                        status === "OVERDUE" ? <OverdueIcon /> : <WarningIcon />
                      }
                      label={status}
                    />
                  )}
                  {hoverItem && (
                    <HoverStyleChip
                      color="primary"
                      size="small"
                      icon={
                        status === "OVERDUE" ? (
                          <OverdueWhiteIcon />
                        ) : (
                          <WarningWhiteIcon />
                        )
                      }
                      label={status}
                    />
                  )}
                </Typography>
                &nbsp;&nbsp;&nbsp;
              </Grid>
              <Grid
                item={true}
                className={
                  status === "OVERDUE" ? classes.redDot : classes.yellowDot
                }
              >
                &nbsp;
              </Grid>
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="caption"
                  className={
                    status === "OVERDUE"
                      ? classes.typographyOverdue
                      : classes.typographyDueInfewDays
                  }
                  color="textSecondary"
                  noWrap
                >
                  &nbsp; {dueDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid container={true} wrap="nowrap">
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <StyleTooltip
                  title={
                    <>
                      <Typography color="inherit">
                        Assigned to {size(approvers)} users. <br />4 have
                        Approved and 6 are Pending.
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
                    noWrap
                  >
                    {approvers.join(",")}
                  </Typography>
                </StyleTooltip>
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
      {hoverItem && (
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
  );
};

export default PendingTrainingPresenter;
